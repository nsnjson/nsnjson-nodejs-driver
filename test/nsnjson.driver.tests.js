var assert = require("assert");

var Driver = require('../src/nsnjson.driver');

var Assets = require('./nsnjson.tests.assets');

describe('Driver @ consistency', function() {
  function testConsistency(name, data, presentation) {

    function assertConsistencyByEncoding() {
      var actualPresentationMaybe = Driver.encode(data);

      assert.equal(actualPresentationMaybe.isJust, true);

      var actualPresentation = actualPresentationMaybe.get();

      var actualDataMaybe = Driver.decode(actualPresentation);

      assert.equal(actualDataMaybe.isJust, true);

      var actualData = actualDataMaybe.get();

      assert.deepEqual(data, actualData);
    }

    function assertConsistencyByDecoding() {
      var actualDataMaybe = Driver.decode(presentation);

      assert.equal(actualDataMaybe.isJust, true);

      var actualData = actualDataMaybe.get();

      var actualPresentationMaybe = Driver.encode(actualData);

      assert.equal(actualPresentationMaybe.isJust, true);

      var actualPresentation = actualPresentationMaybe.get();

      assert.deepEqual(presentation, actualPresentation);
    }

    it(name, function() {
      assertConsistencyByEncoding();

      assertConsistencyByDecoding();
    });
  };

  for (var i = 0; i < Assets.size; i++) {
    var asset = Assets.assets[i];

    testConsistency(asset.name, asset.data, asset.presentation);
  }
});