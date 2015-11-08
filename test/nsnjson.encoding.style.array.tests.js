var assert = require("assert");

var encoder = require('../src/nsnjson.driver').encoderWithArrayStyle();

var Assets = require('./nsnjson.tests.assets');

describe('Encoder @ encode (style / array)', function() {

  function assertEncoding(name, data, presentation) {
    it(name, function() {
      var actualPresentationMaybe = encoder.encode(data);

      assert.equal(actualPresentationMaybe.isJust, true);

      assert.deepEqual(presentation, actualPresentationMaybe.get());
    });
  };

  for (var i = 0; i < Assets.size; i++) {
    var asset = Assets.arrayStyleAssets[i];

    assertEncoding(asset.name, asset.data, asset.presentation);
  }

});