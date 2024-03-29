var xml = require('xml');

module.exports = function(stats, options) {
  var data = {
    assemblies: [
      {
        assembly: [
          {
            _attr: {
              name: 'Mocha Tests',
              total: '4',
              passed: '2',
              failed: '2',
              skipped: '0',
              time: '0.007',
              'run-date': stats.start.toISOString().split('T')[0],
              'run-time': stats.start
                .toISOString()
                .split('T')[1]
                .split('.')[0]
            }
          },
          {
            collection: [
              {
                _attr: {
                  name: 'Foo Bar module',
                  total: '3',
                  passed: '1',
                  failed: '2',
                  skipped: '0',
                  time: '0.003'
                }
              },
              {
                test: [
                  {
                    _attr: {
                      name: 'Foo can weez the juice',
                      time: '0.001',
                      result: 'passed'
                    }
                  }
                ]
              },
              {
                test: [
                  {
                    _attr: {
                      name: 'Bar can narfle the garthog',
                      time: '0.001',
                      result: 'failed'
                    }
                  },
                  {
                    failure: [
                      {
                        _attr: {
                          'exception-type': 'BarError'
                        }
                      },
                      {
                        message: 'expected garthog to be dead'
                      },
                      {
                        'stack-trace': {
                          _cdata: 'expected garthog to be dead'
                        }
                      }
                    ]
                  }
                ]
              },
              {
                test: [
                  {
                    _attr: {
                      name: 'Baz can behave like a flandip',
                      time: '0.001',
                      result: 'failed'
                    }
                  },
                  {
                    failure: [
                      {
                        _attr: {
                          'exception-type': 'BazError'
                        }
                      },
                      {
                        message: 'expected baz to be masher, a hustler, an uninvited grasper of cone'
                      },
                      {
                        'stack-trace': {
                          _cdata: 'BazFile line:1\nBazFile line:2'
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            collection: [
              {
                _attr: {
                  name: 'Another suite!',
                  total: '1',
                  passed: '1',
                  failed: '0',
                  skipped: '0',
                  time: '0.004'
                }
              },
              {
                test: [
                  {
                    _attr: {
                      name: 'Another suite',
                      time: '0.004',
                      result: 'passed'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  if (stats.pending) {
    data.assemblies[0].assembly.push({
      collection: [
        {
          _attr: {
            name: 'Pending suite!',
            total: '1',
            passed: '0',
            failed: '0',
            skipped: '1',
            time: '0'
          }
        },
        {
          test: [
            {
              _attr: {
                name: 'Pending suite',
                time: '0',
                result: 'skipped'
              }
            }
          ]
        }
      ]
    });

    data.assemblies[0].assembly[0]._attr.skipped = 1;
    data.assemblies[0].assembly[0]._attr.total = 5;
  }

  return xml(data, { declaration: true });
};
