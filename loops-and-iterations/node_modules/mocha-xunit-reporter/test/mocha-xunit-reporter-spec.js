/* eslint-env mocha */
'use-strict';

var Reporter = require('../index');
var Runner = require('./helpers/mock-runner');
var Test = require('./helpers/mock-test');

var fs = require('fs');
var path = require('path');

var chai = require('chai');
var expect = chai.expect;
var chaiXML = require('chai-xml');
var mockXml = require('./mock-results');
var testConsole = require('test-console');

var debug = require('debug')('mocha-xunit-reporter:tests');

chai.use(chaiXML);

describe('mocha-xunit-reporter', () => {
  var runner;
  var filePath;
  var MOCHA_FILE;

  function executeTestRunner(options) {
    options = options || {};
    options.invalidChar = options.invalidChar || '';
    options.title = options.title || 'Foo Bar module';
    options.root = typeof options.root !== 'undefined' ? options.root : false;
    runner.start();

    runner.startSuite({
      title: options.title,
      root: options.root,
      tests: [1, 2]
    });

    if (!options.skipPassedTests) {
      runner.pass(new Test('Foo can weez the juice', 'can weez the juice', 1));
    }

    runner.fail(
      new Test('Bar can narfle the garthog', 'can narfle the garthog', 1, {
        name: 'BarError',
        message: 'expected garthog to be dead',
        stack: 'expected garthog to be dead'
      }),
      {
        name: 'BarError',
        message: 'expected garthog to be dead',
        stack: 'expected garthog to be dead'
      }
    );

    runner.fail(
      new Test('Baz can behave like a flandip', 'can behave like a flandip', 1, {
        name: 'BazError',
        message:
          'expected baz to be masher, a hustler, an uninvited grasper of cone',
        stack: 'BazFile line:1\nBazFile line:2'
      }),
      {
        name: 'BazError',
        message:
          'expected baz to be masher, a hustler, an uninvited grasper of cone',
        stack: 'BazFile line:1\nBazFile line:2'
      }
    );

    runner.startSuite({
      title: 'Another suite!',
      tests: [1]
    });
    runner.pass(new Test('Another suite', 'works', 4));

    if (options && options.includePending) {
      runner.startSuite({
        title: 'Pending suite!',
        tests: [1]
      });
      runner.pending(new Test('Pending suite', 'pending'));
    }

    runner.end();
  }

  function verifyMochaFile(path, options) {
    var now = new Date().toISOString();
    debug('verify', now);
    var output = fs.readFileSync(path, 'utf-8');
    expect(output).xml.to.be.valid();
    expect(output).xml.to.equal(mockXml(runner.stats, options));
    fs.unlinkSync(path);
    debug('done', now);
  }

  function removeTestPath() {
    var testPath = '/subdir/foo/mocha.xml';
    var parts = testPath.slice(1).split('/');

    parts.reduce(function(testPath) {
      if (fs.existsSync(__dirname + testPath)) {
        var removeFile =
          testPath.indexOf('.') === -1 ? 'rmdirSync' : 'unlinkSync';
        fs[removeFile](__dirname + testPath);
      }

      return path.dirname(testPath);
    }, testPath);
  }

  function createReporter(options) {
    options = options || {};
    filePath = path.join(path.dirname(__dirname), options.mochaFile || '');

    return new Reporter(runner, { reporterOptions: options });
  }

  function getFileNameWithHash(path) {
    var filenames = fs.readdirSync(path);
    var expected = /(^results\.)([a-f0-9]{32})(\.xml)$/i;

    for (var i = 0; i < filenames.length; i++) {
      if (expected.test(filenames[i])) {
        return filenames[i];
      }
    }
  }

  before(function() {
    // cache this
    MOCHA_FILE = process.env.MOCHA_FILE;
  });

  after(function() {
    // reset this
    process.env.MOCHA_FILE = MOCHA_FILE;
  });

  beforeEach(function() {
    runner = new Runner();
    filePath = undefined;
    delete process.env.MOCHA_FILE;
    delete process.env.PROPERTIES;
  });

  afterEach(function() {
    debug('after');
  });

  it('can produce a XUnit XML report', function() {
    createReporter({ mochaFile: 'test/mocha.xml' });
    executeTestRunner();

    verifyMochaFile(filePath);
  });

  it('respects `process.env.MOCHA_FILE`', function() {
    process.env.MOCHA_FILE = 'test/results.xml';
    createReporter();
    executeTestRunner();

    verifyMochaFile(process.env.MOCHA_FILE);
  });

  it('respects `--reporter-options mochaFile=`', function() {
    createReporter({ mochaFile: 'test/results.xml' });
    executeTestRunner();

    verifyMochaFile(filePath);
  });

  it('respects `[hash]` pattern in test results report filename', function() {
    var dir = 'test/';
    var path = dir + 'results.[hash].xml';
    createReporter({ mochaFile: path });
    executeTestRunner();
    verifyMochaFile(dir + getFileNameWithHash(dir));
  });

  it('will create intermediate directories', function() {
    createReporter({ mochaFile: 'test/subdir/foo/mocha.xml' });
    removeTestPath();
    executeTestRunner();

    verifyMochaFile(filePath);
    removeTestPath();
  });

  it('creates valid XML report for invalid message', function() {
    createReporter({ mochaFile: 'test/mocha.xml' });
    executeTestRunner({ invalidChar: '\u001b' });

    verifyMochaFile(filePath);
  });

  it('outputs skipped tests if "includePending" is specified', function() {
    createReporter({ mochaFile: 'test/mocha.xml', includePending: true });
    executeTestRunner({ includePending: true });

    verifyMochaFile(filePath);
  });

  it('can output to the console', function() {
    createReporter({ mochaFile: 'test/console.xml', toConsole: true });

    var stdout = testConsole.stdout.inspect();
    try {
      executeTestRunner();
      verifyMochaFile(filePath);
    } catch (e) {
      stdout.restore();
      throw e;
    }

    stdout.restore();

    var xml = stdout.output[0];
    expect(xml).xml.to.be.valid();
    expect(xml).xml.to.equal(mockXml(runner.stats));
  });

  function configureReporter(options) {
    var reporter = createReporter(options);

    reporter.flush = function(suites) {
      reporter.suites = suites;
    };

    suiteTitles.forEach(function(title) {
      runner.startSuite({ title: title, suites: [1], tests: [1] });
    });
    runner.end();

    return reporter;
  }

  describe('Output', function() {
    var reporter, assembly;

    beforeEach(function() {
      reporter = spyingReporter();
    });

    it('skips suites with empty tests', function() {
      runner.startSuite({ title: '', tests: [] });
      runner.end();

      expect(assembly).to.be.empty;
    });

    it('skips suites without testcases and suites', function() {
      runner.startSuite({ title: 'test me' });
      runner.end();

      expect(assembly).to.be.empty;
    });

    it('does not skip suites with nested suites', function() {
      runner.startSuite({ title: 'test me', suites: [1], tests: [1] });
      runner.end();

      expect(assembly).to.have.length(1);
    });

    it('does not skip suites with nested tests', function() {
      runner.startSuite({ title: 'test me', tests: [1] });
      runner.end();

      expect(assembly).to.have.length(1);
    });

    it('does not skip root suite', function() {
      runner.startSuite({ title: '', root: true, suites: [1], tests: [1] });
      runner.end();

      expect(assembly).to.have.length(1);
    });

    it('uses "Root Suite" by default', function() {
      runner.startSuite({ title: '', root: true, suites: [1], tests: [1] });
      runner.end();
      expect(assembly[0].collection[0]._attr).to.have.property(
        'name',
        'Untitled Collection'
      );
    });

    function spyingReporter(options) {
      options = options || {};
      options.mochaFile = options.mochaFile || 'test/mocha.xml';

      reporter = createReporter(options);

      reporter.flush = function(suites) {
        assembly = suites;
      };

      return reporter;
    }
  });

  describe('Feature "Configurable addTags"', function() {
    var reporter,
      testsuites,
      mockedTestCase = {
        title: 'should behave like so',
        timestamp: 123,
        tests: '1',
        failures: '0',
        time: '0.004',
        fullTitle: function() {
          return 'Super Suite ' + this.title;
        }
      };

    it('should generate attributes for addTags=true and tags in test title', () => {
      var modTestCase = { ...mockedTestCase };
      modTestCase.title =
        'should behave like so @aid=EPM-DP-C1234 @sid=EPM-1234 @type=Integration';
      reporter = createReporter({ mochaFile: 'test/mocha.xml', addTags: true });
      var testCase = reporter.getTestData(modTestCase);
      expect(testCase.test[0]._attr.name).to.equal(
        'Super Suite should behave like so'
      );
      expect(testCase.test[0]._attr.aid).to.equal('EPM-DP-C1234');
      expect(testCase.test[0]._attr.sid).to.equal('EPM-1234');
    });

    it('should still work for addTags=true and tags NOT in test title', () => {
      reporter = createReporter({ mochaFile: 'test/mocha.xml', addTags: true });
      var testCase = reporter.getTestData(mockedTestCase);
      expect(testCase.test[0]._attr.name).to.equal(mockedTestCase.fullTitle());
    });

    it('should generate traits for addTags=true and tags in test title', () => {
      var modTestCase = { ...mockedTestCase };
      modTestCase.title =
        'should behave like so @aid=EPM-DP-C1234 @sid=EPM-1234 @type=Integration';
      reporter = createReporter({ mochaFile: 'test/mocha.xml', addTags: true });
      var testCase = reporter.getTestData(modTestCase);
      expect(testCase.test[1].traits[0].trait._attr['name']).to.equal('aid');
      expect(testCase.test[1].traits[0].trait._attr['value']).to.equal(
        'EPM-DP-C1234'
      );
      expect(testCase.test[1].traits[1].trait._attr['name']).to.equal('sid');
      expect(testCase.test[1].traits[1].trait._attr['value']).to.equal(
        'EPM-1234'
      );
      expect(testCase.test[1].traits[2].trait._attr['name']).to.equal('type');
      expect(testCase.test[1].traits[2].trait._attr['value']).to.equal(
        'Integration'
      );
    });
  });
});
