var Maybe = require('data.maybe');

var Types = require('../src/nsnjson.types');

var Decoder = require('../src/nsnjson.decoder');

var decoderOptions = {
  'type': function(presentation) {
    return Maybe.Just(presentation[0]);
  }
};

decoderOptions[Types.NULL] = function(presentation) {
  return Maybe.Just(null);
}

decoderOptions[Types.NUMBER] = function(presentation) {
  return Maybe.Just(presentation[1]);
}

decoderOptions[Types.STRING] = function(presentation) {
  return Maybe.Just(presentation[1]);
}

decoderOptions[Types.BOOLEAN] = function(presentation) {
  if (presentation[1] == 1) {
    return Maybe.Just(true);
  }

  if (presentation[1] == 0) {
    return Maybe.Just(false);
  }

  return Maybe.Nothing();
}

decoderOptions[Types.ARRAY] = function(presentation) {
  var array = [];

  var itemsPresentation = presentation[1];

  for (var i = 0, size = itemsPresentation.length; i < size; i++) {
    var itemPresentation = itemsPresentation[i];

    var itemMaybe = this.decode(itemPresentation);

    if (itemMaybe.isJust) {
      var item = itemMaybe.get();

      array.push(item);
    }
  }

  return Maybe.Just(array);
}

decoderOptions[Types.OBJECT] = function(presentation) {
  var object = {};

  var fieldsPresentation = presentation[1];

  for (var i = 0, size = fieldsPresentation.length; i < size; i++) {
    var fieldPresentation = fieldsPresentation[i];

    var name = fieldPresentation[fieldPresentation.length - 1];

    var valueMaybe = this.decode(fieldPresentation);

    if (valueMaybe.isJust) {
      var value = valueMaybe.get();

      object[name] = value;
    }
  }

  return Maybe.Just(object);
}

module.exports = {
  decode: function(presentation) {
    return Decoder.decode(presentation, decoderOptions);
  }
};