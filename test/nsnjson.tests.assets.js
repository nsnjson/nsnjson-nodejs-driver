var path = './assets/';

var assetsCount = 7;

var values = [];

var presentations = [];

for (var i = 1; i <= assetsCount; i++) {
  if (i > 3) {
    values.push(require(path + 'value' + i + '.json'));

    presentations.push(require(path + 'value' + i + 'presentation.json'));
  } else {
    var asset = require(path + 'asset' + i + '.json');

    values.push(asset.data);

    presentations.push(asset.presentation);
  }
}

module.exports = {
  size: assetsCount,
  values: values,
  presentations: presentations
};
