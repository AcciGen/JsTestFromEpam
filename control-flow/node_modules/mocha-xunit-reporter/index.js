'use-strict';

var xml = require('xml');
var Base = require('mocha').reporters.Base;
var fs = require('fs');
var path = require('path');
var debug = require('debug')('mocha-xunit-reporter');
var mkdirp = require('mkdirp');
var md5 = require('md5');
var stripAnsi = require('strip-ansi');
var createStatsCollector = require("mocha/lib/stats-collector");

module.exports = MochaXUnitReporter;

// A subset of invalid characters as defined in http://www.w3.org/TR/xml/#charsets that can occur in e.g. stacktraces
var INVALID_CHARACTERS = ['\u001b'];

function configureDefaults(options) {
  debug(options);
  options = options || {};
  options = options.reporterOptions || {};
  options.mochaFile =
    options.mochaFile || process.env.MOCHA_FILE || 'test-results.xml';
  options.toConsole = !!options.toConsole;
  options.assemblyName = options.assemblyName || 'Mocha Tests';
  options.addTags = options.addTags || false;

  return options;
}

/**
 * Parses title for tags in format @tagName=value
 * @param {} testTitle
 */
function getTags(testTitle) {
  var regexAllTags = /@[A-Za-z]+=[A-Za-z0-9\-]+/gi;
  var regexTag = /@([A-Za-z]+)=([A-Za-z0-9\-]+)/i;

  var result = {
    tags: {},
    cleanTitle: testTitle,
    tagsFound: false
  };

  var foundTags = testTitle.match(regexAllTags);

  if (foundTags && foundTags.length > 0) {
    result.tagsFound = true;
    foundTags.forEach(tag => {
      var parts = tag.match(regexTag);

      result.cleanTitle = result.cleanTitle.replace(tag, '');
      if (parts.length > 0) {
        result.tags[parts[1]] = parts[2];
      }
    });
  }

  result.cleanTitle = result.cleanTitle.trim();

  return result;
}

/**
 * XUnit reporter for mocha.js.
 * @module mocha-xunit-reporter
 * @param {EventEmitter} runner - the test runner
 * @param {Object} options - mocha options
 */
function MochaXUnitReporter(runner, options) {
  createStatsCollector(runner);
  this._options = configureDefaults(options);
  this._runner = runner;
  // get functionality from the Base reporter
  Base.call(this, runner);

  var collections = [];

  function lastCollection() {
    return collections[collections.length - 1].collection;
  }



  // remove old results
  this._runner.on(
    'start',
    function() {
      if (fs.existsSync(this._options.mochaFile)) {
        debug('removing report file', this._options.mochaFile);
        fs.unlinkSync(this._options.mochaFile);
      }
    }.bind(this)
  );

  this._runner.on(
    'suite',
    function(suite) {
      if (suite.tests.length) {
        collections.push(this.getCollectionData(suite));
      }
    }.bind(this)
  );

  this._runner.on(
    'pass',
    function(test) {
      lastCollection().push(this.getTestData(test, 'passed'));
    }.bind(this)
  );

  this._runner.on(
    'fail',
    function(test, err) {
      lastCollection().push(this.getTestData(test, 'failed'));
    }.bind(this)
  );

  if (this._options.includePending) {
    this._runner.on(
      'pending',
      function(test) {
        var test = this.getTestData(test, 'skipped');
        lastCollection().push(test);
      }.bind(this)
    );
  }

  this._runner.on(
    'end',
    function() {
      this.flush(collections);
    }.bind(this)
  );
}

/**
 * Produces an xml node for a test suite
 * @param  {Object} suite - a test suite
 * @return {Object}       - an object representing the xml node
 */
MochaXUnitReporter.prototype.getCollectionData = function(suite) {
  var collection = {
    collection: [
      {
        _attr: {
          name: suite.title || 'Untitled Collection',
          total: suite.tests.length
        }
      }
    ]
  };

  return collection;
};

/**
 * Produces an xml config for a given test case.
 * @param {object} test - test case
 * @param {object} err - if test failed, the failure object
 * @returns {object}
 */
MochaXUnitReporter.prototype.getTestData = function(test, status) {
  var name = stripAnsi(test.fullTitle());

  var tagResult = null;
  if (this._options.addTags) {
    tagResult = getTags(name);
    if (tagResult.tagsFound) {
      name = stripAnsi(tagResult.cleanTitle);
    }
  }

  var testCase = {
    test: [
      {
        _attr: {
          name: name,
          time: typeof test.duration === 'undefined' ? 0 : test.duration / 1000,
          result: status
        }
      }
    ]
  };

  if (tagResult && tagResult.tags) {
    var trait = {
      traits: []
    };
    testCase.test[1] = trait;
    Object.keys(tagResult.tags).forEach(tagName => {
      var tagValue = '';
      if (tagResult.tags[tagName]) {
        tagValue = tagResult.tags[tagName];
      }
      testCase.test[0]._attr[tagName] = tagValue;
      testCase.test[1].traits.push({
        trait: {
          _attr: {
            name: tagName,
            value: tagValue
          }
        }
      });
    });
  }

  if (status === 'failed') {
    testCase.test.push({
      failure: [
        {
          _attr: {
            'exception-type': test.err.name
          }
        },
        {
          message: {
            _cdata: test.err.message
          }
        },
        {
          'stack-trace': {
            _cdata: test.err.stack
          }
        }
      ]
    });
  }

  return testCase;
};

/**
 * @param {string} input
 * @returns {string} without invalid characters
 */
MochaXUnitReporter.prototype.removeInvalidCharacters = function(input) {
  return INVALID_CHARACTERS.reduce(function(text, invalidCharacter) {
    return text.replace(new RegExp(invalidCharacter, 'g'), '');
  }, input);
};

/**
 * Writes xml to disk and ouputs content if "toConsole" is set to true.
 * @param {Array.<Object>} testsuites - a list of xml configs
 */
MochaXUnitReporter.prototype.flush = function(collections) {
  var xml = this.getXml(collections);

  this.writeXmlToDisk(xml, this._options.mochaFile);

  if (this._options.toConsole === true) {
    console.log(xml); // eslint-disable-line no-console
  }
};

/**
 * Produces an XML string from the given test data.
 * @param {Array.<Object>} testsuites - a list of xml configs
 * @returns {string}
 */
MochaXUnitReporter.prototype.getXml = function(collections) {
  var totalSuitesTime = 0;
  var totalTests = 0;
  var totalPassed = 0;
  var totalFailed = 0;
  var totalSkipped = 0;
  var stats = this._runner.stats;

  collections.forEach(function(collection) {
    var _collAttr = collection.collection[0]._attr;

    var _cases = collection.collection.slice(1);

    _collAttr.failed = 0;
    _collAttr.passed = 0;
    _collAttr.total = 0;
    _collAttr.time = 0;
    _collAttr.skipped = 0;

    _cases.forEach(function(test) {
      if (test.test[0]._attr.result == 'skipped') {
        _collAttr.skipped++;
      }
      if (test.test[0]._attr.result == 'failed') {
        _collAttr.failed++;
      }
      if (test.test[0]._attr.result == 'passed') {
        _collAttr.passed++;
      }
      _collAttr.time += test.test[0]._attr.time;
    });

    _collAttr.total = _collAttr.skipped + _collAttr.failed + _collAttr.passed;

    totalSuitesTime += _collAttr.time;
    totalTests += _collAttr.total;
    totalPassed += _collAttr.passed;
    totalSkipped += _collAttr.skipped;
    totalFailed += _collAttr.failed;
  });

  var assembly = {
    assembly: [
      {
        _attr: {
          name: this._options.assemblyName,
          time: totalSuitesTime,
          total: totalTests,
          failed: totalFailed,
          passed: totalPassed,
          skipped: totalSkipped,
          'run-date': stats.start.toISOString().split('T')[0],
          'run-time': stats.start
            .toISOString()
            .split('T')[1]
            .split('.')[0]
        }
      }
    ].concat(collections)
  };

  return xml(
    {
      assemblies: [assembly]
    },
    { declaration: true, indent: '  ' }
  );
};

/**
 * Writes a XUnit test report XML document.
 * @param {string} xml - xml string
 * @param {string} filePath - path to output file
 */
MochaXUnitReporter.prototype.writeXmlToDisk = function(xml, filePath) {
  if (filePath) {
    if (filePath.indexOf('[hash]') !== -1) {
      filePath = filePath.replace('[hash]', md5(xml));
    }

    debug('writing file to', filePath);
    mkdirp.sync(path.dirname(filePath));

    try {
      fs.writeFileSync(filePath, xml, 'utf-8');
    } catch (exc) {
      debug('problem writing results: ' + exc);
    }
    debug('results written successfully');
  }
};
