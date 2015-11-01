var assert = require("assert");

var Encoder = require('../src/nsnjson.encoder');

var Assets = require('./nsnjson.tests.assets');

describe('Encoder @ encode', function() {

  function assertEncoding(name, data, presentation) {
    it(name, function() {
      var actualPresentationMaybe = Encoder.encode(data);

      assert.equal(actualPresentationMaybe.isJust, true);

      assert.deepEqual(presentation, actualPresentationMaybe.get());
    });
  };

  for (var i = 0; i < Assets.size; i++) {
    var asset = Assets.assets[i];

    assertEncoding(asset.name, asset.data, asset.presentation);
  }

});