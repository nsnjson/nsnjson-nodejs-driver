var Maybe = require('data.maybe');

var Decoding = require('./nsnjson.decoding');

var Types = require('./nsnjson.types');

var Format = require('./nsnjson.format');

function ObjectStyleDecoding(customTypesDecoders) {
  Decoding.call(this, customTypesDecoders);
}

ObjectStyleDecoding.prototype = Object.create(Decoding.prototype);

ObjectStyleDecoding.prototype.getType = function(presentation) {
  var customTypeMaybe = Decoding.prototype.getType.call(this, presentation);

  return customTypeMaybe.orElse(function() {
    if (!presentation.hasOwnProperty('t')) {
      return Maybe.Just(Types.NULL);
    }

    switch (presentation.t) {
      case Format.TYPE_MARKER_NUMBER:  return Maybe.Just(Types.NUMBER);
      case Format.TYPE_MARKER_STRING:  return Maybe.Just(Types.STRING);
      case Format.TYPE_MARKER_BOOLEAN: return Maybe.Just(Types.BOOLEAN);
      case Format.TYPE_MARKER_ARRAY:   return Maybe.Just(Types.ARRAY);
      case Format.TYPE_MARKER_OBJECT:  return Maybe.Just(Types.OBJECT);
    }

    return Maybe.Nothing();
  });
}

ObjectStyleDecoding.prototype.decodeNull = function() {
  return Maybe.Just(null);
}

ObjectStyleDecoding.prototype.decodeNumber = function(presentation) {
  return Maybe.Just(presentation.v);
}

ObjectStyleDecoding.prototype.decodeString = function(presentation) {
  return Maybe.Just(presentation.v);
}

ObjectStyleDecoding.prototype.decodeBoolean = function(presentation) {
  switch (presentation.v) {
    case 1: return Maybe.Just(true);
    case 0: return Maybe.Just(false);
  }

  return Maybe.Nothing();
}

ObjectStyleDecoding.prototype.decodeArray = function(presentation) {
  var array = [];

  var itemsPresentation = presentation.v;

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

ObjectStyleDecoding.prototype.decodeObject = function(presentation) {
  var object = {};

  var fieldsPresentation = presentation.v;

  for (var i = 0, size = fieldsPresentation.length; i < size; i++) {
    var fieldPresentation = fieldsPresentation[i];

    var name = fieldPresentation.n;

    var valueMaybe = this.decode(fieldPresentation);

    if (valueMaybe.isJust) {
      var value = valueMaybe.get();

      object[name] = value;
    }
  }

  return Maybe.Just(object);
}

module.exports = ObjectStyleDecoding;