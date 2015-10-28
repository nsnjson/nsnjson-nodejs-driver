var path = './assets/';

var assetsCount = 7;

var assets = [];

var values = [];

var presentations = [];

for (var i = 1; i <= assetsCount; i++) {
  var asset = require(path + 'asset' + i + '.json');

  values.push(asset.data);

  presentations.push(asset.presentation);

  assets.push(asset);
}

module.exports = {
  size: assetsCount,
  assets: assets,
  values: values,
  presentations: presentations
};
