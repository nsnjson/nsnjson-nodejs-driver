var assert = require("assert");

var Decoder = require('../src/nsnjson.decoder');

var Assets = require('./nsnjson.tests.assets');

describe('Decoder @ decode', function() {

  function assertDecoding(name, data, presentation) {
    it(name, function() {
      var actualDataMaybe = Decoder.decode(presentation);

      assert.equal(actualDataMaybe.isJust, true);

      assert.deepEqual(data, actualDataMaybe.get());
    });
  };

  for (var i = 0; i < Assets.size; i++) {
    var asset = Assets.assets[i];

    assertDecoding(asset.name, asset.data, asset.presentation);
  }

});