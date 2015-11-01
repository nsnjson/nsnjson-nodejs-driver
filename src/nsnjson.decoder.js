var Maybe = require('data.maybe');

var Format = require('./nsnjson.format');

var Types = require('./nsnjson.types');

function Decoding() {}

Decoding.prototype.getType = function(presentation) {
  switch (presentation.t) {
    case Format.TYPE_MARKER_NULL:    return Maybe.Just(Types.NULL);
    case Format.TYPE_MARKER_NUMBER:  return Maybe.Just(Types.NUMBER);
    case Format.TYPE_MARKER_STRING:  return Maybe.Just(Types.STRING);
    case Format.TYPE_MARKER_BOOLEAN: return Maybe.Just(Types.BOOLEAN);
    case Format.TYPE_MARKER_ARRAY:   return Maybe.Just(Types.ARRAY);
    case Format.TYPE_MARKER_OBJECT:  return Maybe.Just(Types.OBJECT);
  }

  return Maybe.Nothing();
}

Decoding.prototype.decodeNull = function() {
  return Maybe.Just(null);
}

Decoding.prototype.decodeNumber =  function(presentation) {
  return Maybe.Just(presentation.v);
}

Decoding.prototype.decodeString = function(presentation) {
  return Maybe.Just(presentation.v);
}

Decoding.prototype.decodeBoolean = function(presentation) {
  if (presentation.v == 1) {
    return Maybe.Just(true);
  }

  if (presentation.v == 0) {
    return Maybe.Just(false);
  }

  return Maybe.Nothing();
}

Decoding.prototype.decodeArray = function(presentation) {
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

Decoding.prototype.decodeObject = function(presentation) {
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
};

Decoding.prototype.decode = function(presentation) {
  var typeOption = this.getType(presentation);

  if (typeOption.isJust) {
    var type = typeOption.get();

    switch (type) {
      case Types.NULL:    return this.decodeNull();
      case Types.NUMBER:  return this.decodeNumber(presentation);
      case Types.STRING:  return this.decodeString(presentation);
      case Types.BOOLEAN: return this.decodeBoolean(presentation);
      case Types.ARRAY:   return this.decodeArray(presentation);
      case Types.OBJECT:  return this.decodeObject(presentation);
    }
  }

  return Maybe.Nothing();
}

/**
 * @module Decoder
 */
module.exports = {
  /**
   * @param {JSON} presentation NSNJSON presentation of JSON
   * @param {Object} options Decoder options
   */
  decode: function(presentation, options) {
    var decodersNames = [Types.NULL, Types.NUMBER, Types.STRING, Types.BOOLEAN, Types.ARRAY, Types.OBJECT];

    var decoding = new Decoding();

    if (options && (options instanceof Object)) {
      if (options.hasOwnProperty('type')) {
        decoding.getType = options['type'];
      }

      for (var i = 0, decodersNamesCount = decodersNames.length; i < decodersNamesCount; i++) {
        var decoderName = decodersNames[i];

        if (options.hasOwnProperty(decoderName)) {
          var customDecoder = options[decoderName];

          if (customDecoder instanceof Function) {
            switch (decoderName) {
              case Types.NULL:    decoding.decodeNull    = customDecoder; break;
              case Types.NUMBER:  decoding.decodeNumber  = customDecoder; break;
              case Types.STRING:  decoding.decodeString  = customDecoder; break;
              case Types.BOOLEAN: decoding.decodeBoolean = customDecoder; break;
              case Types.ARRAY:   decoding.decodeArray   = customDecoder; break;
              case Types.OBJECT:  decoding.decodeObject  = customDecoder; break;
            }
          }
        }
      }
    }

    return decoding.decode(presentation);
  }
};