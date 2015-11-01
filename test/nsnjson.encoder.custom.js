var Maybe = require('data.maybe');

var Types = require('../src/nsnjson.types');

var Encoder = require('../src/nsnjson.encoder');

var encoderOptions = {};

encoderOptions[Types.NULL] = function() {
  return Maybe.Just([Types.NULL]);
}

encoderOptions[Types.NUMBER] = function(value) {
  return Maybe.Just([Types.NUMBER, value]);
}

encoderOptions[Types.STRING] = function(value) {
  return Maybe.Just([Types.STRING, value]);
}

encoderOptions[Types.BOOLEAN] = function(value) {
  return Maybe.Just([Types.BOOLEAN, ~~value]);
}

encoderOptions[Types.ARRAY] = function(array) {
  var itemsPresentation = [];

  for (var i = 0, size = array.length; i < size; i++) {
    var itemPresentationMaybe = this.encode(array[i]);

    if (itemPresentationMaybe.isJust) {
      var itemPresentation = itemPresentationMaybe.get();

      itemsPresentation.push(itemPresentation);
    }
  }

  return Maybe.Just([Types.ARRAY, itemsPresentation]);
}

encoderOptions[Types.OBJECT] = function(object) {
  var fieldsPresentation = [];

  for (var name in object) {
    if (object.hasOwnProperty(name)) {
      var valuePresentationMaybe = this.encode(object[name]);

      if (valuePresentationMaybe.isJust) {
        var valuePresentation = valuePresentationMaybe.get();

        var fieldPresentation = valuePresentation.slice();

        fieldPresentation.push(name);

        fieldsPresentation.push(fieldPresentation);
      }
    }
  }

  return Maybe.Just([Types.OBJECT, fieldsPresentation]);
}

module.exports = {
  encode: function(data) {
    return Encoder.encode(data, encoderOptions);
  }
};