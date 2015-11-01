var path = './assets/';

var assetsCount = 11;

var assets = [];

var customAssets = [];

for (var i = 1; i <= assetsCount; i++) {
  assets.push(require(path + 'asset' + i + '.json'));

  customAssets.push(require(path + 'custom.asset' + i + '.json'));
}

module.exports = {
  size: assetsCount,
  assets: assets,
  customAssets: customAssets
};