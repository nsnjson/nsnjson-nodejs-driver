var assert = require("assert");

var Encoder = require('../src/nsnjson.encoder');

var Assets = require('./nsnjson.tests.assets');

describe('Encoder @ encode', function() {
  function testEncoding(value, presentation) {
    var toString = JSON.stringify;

    it(toString(value), function() {
      var actualPresentation = Encoder.encode(value);

      assert.equal(toString(presentation), toString(actualPresentation));
    });
  };

  for (var i = 0; i < Assets.size; i++) {
    var asset = Assets.assets[i];

    testEncoding(asset.data, asset.presentation);
  }
});
