var Assert = require('assert');

var CustomEncoder = require('./nsnjson.encoder.custom');

var Assets = require('./nsnjson.tests.assets');

describe('Encoder @ encode (custom)', function() {

  function assertEncoding(name, data, presentation) {
    it(name, function() {
      var actualPresentationMaybe = CustomEncoder.encode(data);

      Assert.equal(actualPresentationMaybe.isJust, true);

      var actualPresentation = actualPresentationMaybe.get();

      Assert.deepEqual(presentation, actualPresentation);
    });
  }

  for (var i = 0; i < Assets.size; i++) {
    var asset = Assets.customAssets[i];

    assertEncoding(asset.name, asset.data, asset.presentation);
  }

});