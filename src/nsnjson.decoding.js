var Maybe = require('data.maybe');

var Types = require('./nsnjson.types');

function Decoding() {}

Decoding.customize = function(DecodingClass, customDecoders) {
  var jsonTypes = [Types.NULL, Types.NUMBER, Types.STRING, Types.BOOLEAN, Types.ARRAY, Types.OBJECT];

  if (customDecoders && (customDecoders instanceof Object)) {
    for (var i = 0, jsonTypesCount = jsonTypes.length; i < jsonTypesCount; i++) {
      var jsonType = jsonTypes[i];

      if (customDecoders.hasOwnProperty(jsonType)) {
        var customDecoder = customDecoders[encoderName];

        if (customDecoder instanceof Function) {
          switch (jsonType) {
            case Types.NULL:    DecodingClass.prototype.decodeNull    = customDecoder; break;
            case Types.NUMBER:  DecodingClass.prototype.decodeNumber  = customDecoder; break;
            case Types.STRING:  DecodingClass.prototype.decodeString  = customDecoder; break;
            case Types.BOOLEAN: DecodingClass.prototype.decodeBoolean = customDecoder; break;
            case Types.ARRAY:   DecodingClass.prototype.decodeArray   = customDecoder; break;
            case Types.OBJECT:  DecodingClass.prototype.decodeObject  = customDecoder; break;
          }
        }
      }
    }
  }

  return new DecodingClass();
}

Decoding.prototype.getType = function(presentation) {
  throw new Error('Method { Decoding @ getType } is not implemented!');
}

Decoding.prototype.decodeNull = function() {
  throw new Error('Method { Decoding @ decodeNull } is not implemented!');
}

Decoding.prototype.decodeNumber =  function(presentation) {
  throw new Error('Method { Decoding @ decodeNumber } is not implemented!');
}

Decoding.prototype.decodeString = function(presentation) {
  throw new Error('Method { Decoding @ decodeString } is not implemented!');
}

Decoding.prototype.decodeBoolean = function(presentation) {
  throw new Error('Method { Decoding @ decodeBoolean } is not implemented!');
}

Decoding.prototype.decodeArray = function(presentation) {
  throw new Error('Method { Decoding @ decodeArray } is not implemented!');
}

Decoding.prototype.decodeObject = function(presentation) {
  throw new Error('Method { Decoding @ decodeObject } is not implemented!');
};

Decoding.prototype.decode = function(presentation) {
  var typeMaybe = this.getType(presentation);

  if (typeMaybe.isJust) {
    var type = typeMaybe.get();

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

module.exports = Decoding;