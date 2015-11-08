var Maybe = require('data.maybe');

var Decoding = require('./nsnjson.decoding');

var Types = require('./nsnjson.types');

var Format = require('./nsnjson.format');

function ArrayStyleDecoding(customTypesDecoders) {
  this.customTypesDecoders = customTypesDecoders;
}

ArrayStyleDecoding.prototype = Object.create(Decoding.prototype);

ArrayStyleDecoding.prototype.getType = function(presentation) {
  var customTypesDecoders = this.customTypesDecoders;

  for (var type in customTypesDecoders) {
    if (customTypesDecoders.hasOwnProperty(type)) {
      var customDecoder = customTypesDecoders[type];

      with (customDecoder) {
        if (detector(presentation)) {
          return Maybe.Just(type);
        }
      }
    }
  }

  if (presentation.length == 0) {
    return Maybe.Just(Types.NULL);
  }

  switch (presentation[0]) {
    case Format.TYPE_MARKER_NUMBER:  return Maybe.Just(Types.NUMBER);
    case Format.TYPE_MARKER_STRING:  return Maybe.Just(Types.STRING);
    case Format.TYPE_MARKER_BOOLEAN: return Maybe.Just(Types.BOOLEAN);
    case Format.TYPE_MARKER_ARRAY:   return Maybe.Just(Types.ARRAY);
    case Format.TYPE_MARKER_OBJECT:  return Maybe.Just(Types.OBJECT);
  }

  return Maybe.Nothing();
}

ArrayStyleDecoding.prototype.decodeNull = function() {
  return Maybe.Just(null);
}

ArrayStyleDecoding.prototype.decodeNumber = function(presentation) {
  return Maybe.Just(presentation[1]);
}

ArrayStyleDecoding.prototype.decodeString = function(presentation) {
  return Maybe.Just(presentation[1]);
}

ArrayStyleDecoding.prototype.decodeBoolean = function(presentation) {
  switch (presentation[1]) {
    case 1: return Maybe.Just(true);
    case 0: return Maybe.Just(false);
  }

  return Maybe.Nothing();
}

ArrayStyleDecoding.prototype.decodeArray = function(presentation) {
  var array = [];

  for (var i = 1, size = presentation.length; i < size; i++) {
    var itemPresentation = presentation[i];

    var itemMaybe = this.decode(itemPresentation);

    if (itemMaybe.isJust) {
      var item = itemMaybe.get();

      array.push(item);
    }
  }

  return Maybe.Just(array);
}

ArrayStyleDecoding.prototype.decodeObject = function(presentation) {
  var object = {};

  for (var i = 1, size = presentation.length; i < size; i++) {
    var fieldPresentation = presentation[i];

    var name = fieldPresentation[0];

    var valueMaybe = this.decode(fieldPresentation[1]);

    if (valueMaybe.isJust) {
      var value = valueMaybe.get();

      object[name] = value;
    }
  }

  return Maybe.Just(object);
}

module.exports = ArrayStyleDecoding;