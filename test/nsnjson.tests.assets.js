var path = './assets/';

var assetsCount = 7;

var values = [];

var presentations = [];

for (var i = 1; i <= assetsCount; i++) {
  values.push(require(path + 'value' + i + '.json'));

  presentations.push(require(path + 'value' + i + 'presentation.json'));
}

module.exports = {
  size: assetsCount,
  values: values,
  presentations: presentations
};
