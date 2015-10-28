var assert = require("assert");

var Driver = require('../src/nsnjson.driver');

var Assets = require('./nsnjson.tests.assets');

describe('Driver @ consistency', function() {
  function testConsistency(value) {
    var toString = JSON.stringify;

    it(toString(value), function() {
      var actualValue = Driver.decode(Driver.encode(value));

      assert.equal(toString(value), toString(actualValue));
    });
  };

  for (var i = 0; i < Assets.size; i++) {
    testConsistency(Assets.assets[i].data);
  }
});
