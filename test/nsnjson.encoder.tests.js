var assert = require("assert");

var Encoder = require('../src/nsnjson.encoder');

var Assets = require('./nsnjson.tests.assets');

describe('Encoder @ encode', function() {
  function testEncoding(value, presentation) {
    it(JSON.stringify(value), function() {
      var actualPresentationMaybe = Encoder.encode(value);

      assert.equal(actualPresentationMaybe.isJust, true);

      var actualPresentation = actualPresentationMaybe.get();

      assert.deepEqual(presentation, actualPresentation);
    });
  };

  for (var i = 0; i < Assets.size; i++) {
    var asset = Assets.assets[i];

    testEncoding(asset.data, asset.presentation);
  }
});
