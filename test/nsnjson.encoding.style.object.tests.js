var assert = require("assert");

var encoder = require('../src/nsnjson.driver').encoderWithObjectStyle();

var Assets = require('./nsnjson.tests.assets');

describe('Encoder @ encode (style / object)', function() {

  function assertEncoding(name, data, presentation) {
    it(name, function() {
      var actualPresentationMaybe = encoder.encode(data);

      assert.equal(actualPresentationMaybe.isJust, true);

      assert.deepEqual(presentation, actualPresentationMaybe.get());
    });
  };

  for (var i = 0; i < Assets.size; i++) {
    var asset = Assets.objectStyleAssets[i];

    assertEncoding(asset.name, asset.data, asset.presentation);
  }

});