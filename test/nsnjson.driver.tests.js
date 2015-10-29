var assert = require("assert");

var Driver = require('../src/nsnjson.driver');

var Assets = require('./nsnjson.tests.assets');

describe('Driver @ consistency', function() {
  function testConsistency(value) {
    it(JSON.stringify(value), function() {
      var encodedValueMaybe = Driver.encode(value);

      assert.equal(encodedValueMaybe.isJust, true);

      var encodedValue = encodedValueMaybe.get();

      var actualValueMaybe = Driver.decode(encodedValue);

      assert.equal(actualValueMaybe.isJust, true);

      var actualValue = actualValueMaybe.get();

      assert.deepEqual(value, actualValue);
    });
  };

  for (var i = 0; i < Assets.size; i++) {
    testConsistency(Assets.assets[i].data);
  }
});
