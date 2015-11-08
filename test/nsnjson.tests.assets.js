var path = './assets/';

var assetsCount = 11;

var assets = [];

var customAssets = [];

var arrayStyleAssets = [];

var objectStyleAssets = [];

for (var i = 1; i <= assetsCount; i++) {
  assets.push(require(path + 'asset' + i + '.json'));

  customAssets.push(require(path + 'custom.asset' + i + '.json'));

  var assetId = i < 10 ? '0' + i : i;

  arrayStyleAssets.push(require(path + 'style/array.style.asset.' + assetId + '.json'));

  objectStyleAssets.push(require(path + 'style/object.style.asset.' + assetId + '.json'));
}

module.exports = {
  size: assetsCount,
  assets: assets,
  customAssets: customAssets,
  arrayStyleAssets: arrayStyleAssets,
  objectStyleAssets: objectStyleAssets
};