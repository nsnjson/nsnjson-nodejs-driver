var assert = require("assert");

var decoder = require('../src/nsnjson.driver').decoderWithObjectStyle();

var Assets = require('./nsnjson.tests.assets');

describe('Decoder @ decode (style / object)', function() {

  function assertDecoding(name, data, presentation) {
    it(name, function() {
      var actualDataMaybe = decoder.decode(presentation);

      assert.equal(actualDataMaybe.isJust, true);

      assert.deepEqual(data, actualDataMaybe.get());
    });
  };

  for (var i = 0; i < Assets.size; i++) {
    var asset = Assets.objectStyleAssets[i];

    assertDecoding(asset.name, asset.data, asset.presentation);
  }

});