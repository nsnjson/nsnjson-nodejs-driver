var path = './assets/';

var assetsCount = 7;

var assets = [];

var presentations = [];

for (var i = 1; i <= assetsCount; i++) {
  var asset = require(path + 'asset' + i + '.json');

  presentations.push(asset.presentation);

  assets.push(asset);
}

module.exports = {
  size: assetsCount,
  assets: assets,
  presentations: presentations
};
