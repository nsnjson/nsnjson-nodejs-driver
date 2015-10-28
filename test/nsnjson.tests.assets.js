var path = './assets/';

var assetsCount = 7;

var values = [];

var presentations = [];

for (var i = 1; i <= assetsCount; i++) {
  var asset = require(path + 'asset' + i + '.json');

  values.push(asset.data);

  presentations.push(asset.presentation);
}

module.exports = {
  size: assetsCount,
  values: values,
  presentations: presentations
};
