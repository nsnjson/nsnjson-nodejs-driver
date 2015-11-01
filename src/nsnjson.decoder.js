var Maybe = require('data.maybe');

var Format = require('./nsnjson.format');

function Decoding() {}

Decoding.prototype.getType = function(presentation) {
  switch (presentation.t) {
    case Format.TYPE_MARKER_NULL:
      return Maybe.Just('null');
    case Format.TYPE_MARKER_NUMBER:
      return Maybe.Just('number');
    case Format.TYPE_MARKER_STRING:
      return Maybe.Just('string');
    case Format.TYPE_MARKER_BOOLEAN:
      return Maybe.Just('boolean');
    case Format.TYPE_MARKER_ARRAY:
      return Maybe.Just('array');
    case Format.TYPE_MARKER_OBJECT:
      return Maybe.Just('object');
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
      case 'null':
        return this.decodeNull();
      case 'number':
        return this.decodeNumber(presentation);
      case 'string':
        return this.decodeString(presentation);
      case 'boolean':
        return this.decodeBoolean(presentation);
      case 'array':
        return this.decodeArray(presentation);
      case 'object':
        return this.decodeObject(presentation);
    }
  }

  return Maybe.Nothing();
}

module.exports = {
  decode: function(presentation, customDecoders) {
    var decodersNames = ['null', 'number', 'string','boolean', 'array', 'object'];

    var decoding = new Decoding();

    if (customDecoders && (customDecoders instanceof Object)) {
      if (customDecoders.hasOwnProperty('type')) {
        decoding.getType = customDecoders['type'];
      }

      for (var i = 0, decodersNamesCount = decodersNames.length; i < decodersNamesCount; i++) {
        var decoderName = decodersNames[i];

        if (customDecoders.hasOwnProperty(decoderName)) {
          var customDecoder = customDecoders[decoderName];

          if (customDecoder instanceof Function) {
            switch (decoderName) {
              case 'null':
                decoding.decodeNull = customDecoder;
                break;
              case 'number':
                decoding.decodeNumber = customDecoder;
                break
              case 'string':
                decoding.decodeString = customDecoder;
                break;
              case 'boolean':
                decoding.decodeBoolean = customDecoder;
                break;
              case 'array':
                decoding.decodeArray = customDecoder;
                break;
              case 'object':
                decoding.decodeObject = customDecoder;
                break;
            }
          }
        }
      }
    }

    return decoding.decode(presentation);
  }
};