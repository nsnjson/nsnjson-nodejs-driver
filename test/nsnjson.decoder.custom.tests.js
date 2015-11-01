var Assert = require('assert');

var CustomDecoder = require('./nsnjson.decoder.custom');

var Assets = require('./nsnjson.tests.assets');

describe('Decoder @ decode (custom)', function() {

  function assertDecoding(name, data, presentation) {
    it(name, function() {
      var actualDataMaybe = CustomDecoder.decode(presentation);

      Assert.equal(actualDataMaybe.isJust, true);

      Assert.deepEqual(data, actualDataMaybe.get());
    });
  }

  for (var i = 0; i < Assets.size; i++) {
    var asset = Assets.customAssets[i];

    assertDecoding(asset.name, asset.data, asset.presentation);
  }

});