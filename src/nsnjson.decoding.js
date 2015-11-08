var Maybe = require('data.maybe');

var Types = require('./nsnjson.types');

function Decoding(customTypesDecoders) {
  this.customTypesDecoders = customTypesDecoders;
}

Decoding.customize = function(DecodingClass, customDecoders) {
  var customTypesDecoders = {};

  if (customDecoders && (customDecoders instanceof Object)) {
    for (var type in customDecoders) {
      if (customDecoders.hasOwnProperty(type)) {
        var customDecoder = customDecoders[type];

        if (Types.list.indexOf(type) >= 0) {
          if (customDecoder instanceof Function) {
            switch (type) {
              case Types.NULL:    DecodingClass.prototype.decodeNull    = customDecoder; break;
              case Types.NUMBER:  DecodingClass.prototype.decodeNumber  = customDecoder; break;
              case Types.STRING:  DecodingClass.prototype.decodeString  = customDecoder; break;
              case Types.BOOLEAN: DecodingClass.prototype.decodeBoolean = customDecoder; break;
              case Types.ARRAY:   DecodingClass.prototype.decodeArray   = customDecoder; break;
              case Types.OBJECT:  DecodingClass.prototype.decodeObject  = customDecoder; break;
            }
          }
        } else {
          if (customDecoder instanceof Object) {
            var hasDetector = customDecoder.hasOwnProperty('detector') && customDecoder.detector instanceof Function;

            var hasDecoder = customDecoder.hasOwnProperty('decoder') && customDecoder.decoder instanceof Function;

            if (hasDetector && hasDecoder) {
              customTypesDecoders[type] = customDecoder;
            }
          }
        }
      }
    }
  }

  return new DecodingClass(customTypesDecoders);
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

    var customTypesDecoders = this.customTypesDecoders;

    if (customTypesDecoders.hasOwnProperty(type)) {
      var customDecoder = customTypesDecoders[type];

      with (customDecoder) {
        if (detector(presentation)) {
          return decoder(presentation);
        }
      }
    }

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