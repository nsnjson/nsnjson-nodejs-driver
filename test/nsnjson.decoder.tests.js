var assert = require("assert");

var Decoder = require('../src/nsnjson.decoder');

var Assets = require('./nsnjson.tests.assets');

describe('Decoder @ decode', function() {
  function testDecoding(presentation, value) {
    it(JSON.stringify(value), function() {
      var actualValueMaybe = Decoder.decode(presentation);

      assert.equal(actualValueMaybe.isJust, true);

      var actualValue = actualValueMaybe.get();

      assert.deepEqual(value, actualValue);
    });
  };

  for (var i = 0; i < Assets.size; i++) {
    var asset = Assets.assets[i];

    testDecoding(asset.presentation, asset.data);
  }
});
