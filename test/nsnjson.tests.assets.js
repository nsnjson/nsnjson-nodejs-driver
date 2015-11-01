var path = './assets/';

var assetsCount = 11;

var assets = [];

for (var i = 1; i <= assetsCount; i++) {
  var asset = require(path + 'asset' + i);

  assets.push(asset);
}

module.exports = {
  size: assetsCount,
  assets: assets
};