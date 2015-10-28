var assert = require("assert");

var Decoder = require('../src/nsnjson.decoder');

var Assets = require('./nsnjson.tests.assets');

describe('Decoder @ decode', function() {
  function testDecoding(presentation, value) {
    var toString = JSON.stringify;

    it(toString(value), function() {
      var actualValue = Decoder.decode(presentation);

      assert.equal(toString(value), toString(actualValue));
    });
  };

  for (var i = 0; i < Assets.size; i++) {
    var asset = Assets.assets[i];

    testDecoding(asset.presentation, asset.data);
  }
});
