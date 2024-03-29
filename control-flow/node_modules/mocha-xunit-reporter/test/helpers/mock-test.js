'use strict';

function Test(fullTitle, title, duration, err) {
  var test = {
    title: title,
    duration: duration,
    fullTitle: function() { return fullTitle; },
    slow: function() {}
  };

  if (err) {
    test[err] = err;
  }

  return test;
}

module.exports = Test;
