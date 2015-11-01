var assert = require("assert");

var CustomDriver = require('./nsnjson.driver.custom');

var Assets = require('./nsnjson.tests.assets');

describe('Driver @ consistency (custom)', function() {

  function assertConsistency(name, data, presentation) {

    function assertConsistencyByEncoding() {
      var actualPresentationMaybe = CustomDriver.encode(data);

      assert.equal(actualPresentationMaybe.isJust, true);

      var actualPresentation = actualPresentationMaybe.get();

      var actualDataMaybe = CustomDriver.decode(actualPresentation);

      assert.equal(actualDataMaybe.isJust, true);

      var actualData = actualDataMaybe.get();

      assert.deepEqual(data, actualData);
    }

    function assertConsistencyByDecoding() {
      var actualDataMaybe = CustomDriver.decode(presentation);

      assert.equal(actualDataMaybe.isJust, true);

      var actualData = actualDataMaybe.get();

      var actualPresentationMaybe = CustomDriver.encode(actualData);

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
    var asset = Assets.customAssets[i];

    assertConsistency(asset.name, asset.data, asset.presentation);
  }

});