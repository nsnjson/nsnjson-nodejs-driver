var path = './assets/';

var assetsCount = 7;

var assets = [];

for (var i = 1; i <= assetsCount; i++) {
  var asset = require(path + 'asset' + i + '.json');

  assets.push(asset);
}

module.exports = {
  size: assetsCount,
  assets: assets
};