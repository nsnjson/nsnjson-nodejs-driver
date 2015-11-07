var Maybe = require('data.maybe');

var Types = require('./nsnjson.types');

function Encoding() {}

Encoding.isNull = function(data) {
  return (data == null);
}

Encoding.isBoolean = function(data) {
  return (typeof(data) == 'boolean') || (data instanceof Boolean);
}

Encoding.isNumber = function(data) {
  return (typeof(data) == 'number') || (data instanceof Number);
}

Encoding.isString = function(data) {
  return (typeof(data) == 'string') || (data instanceof String);
}

Encoding.isArray = function(data) {
  return (data instanceof Array);
}

Encoding.isObject = function(data) {
  return (data instanceof Object);
}

Encoding.customize = function(EncodingClass, customEncoders) {
  var jsonTypes = [Types.NULL, Types.NUMBER, Types.STRING, Types.BOOLEAN, Types.ARRAY, Types.OBJECT];

  if (customEncoders && (customEncoders instanceof Object)) {
    for (var i = 0, jsonTypesCount = encodersNames.length; i < jsonTypesCount; i++) {
      var jsonType = jsonTypes[i];

      if (customEncoders.hasOwnProperty(jsonTypes)) {
        var customEncoder = customEncoders[encoderName];

        if (customEncoder instanceof Function) {
          switch (encoderName) {
            case Types.NULL:    EncodingClass.prototype.encodeNull    = customEncoder; break;
            case Types.NUMBER:  EncodingClass.prototype.encodeNumber  = customEncoder; break;
            case Types.STRING:  EncodingClass.prototype.encodeString  = customEncoder; break;
            case Types.BOOLEAN: EncodingClass.prototype.encodeBoolean = customEncoder; break;
            case Types.ARRAY:   EncodingClass.prototype.encodeArray   = customEncoder; break;
            case Types.OBJECT:  EncodingClass.prototype.encodeObject  = customEncoder; break;
          }
        }
      }
    }
  }

  return new EncodingClass();
}

Encoding.prototype.encodeNull = function() {
  throw new Error('Method { Encoding @ encodeNull } is not implemented!');
}

Encoding.prototype.encodeNumber = function(value) {
  throw new Error('Method { Encoding @ encodeNumber } is not implemented!');
}

Encoding.prototype.encodeString = function(value) {
  throw new Error('Method { Encoding @ encodeString } is not implemented!');
}

Encoding.prototype.encodeBoolean = function(value) {
  throw new Error('Method { Encoding @ encodeBoolean } is not implemented!');
}

Encoding.prototype.encodeArray = function(array) {
  throw new Error('Method { Encoding @ encodeArray } is not implemented!');
}

Encoding.prototype.encodeObject = function(object) {
  throw new Error('Method { Encoding @ encodeObject } is not implemented!');
}

Encoding.prototype.encode = function(data) {
  if (Encoding.isNull(data)) {
    return this.encodeNull();
  }

  if (Encoding.isNumber(data)) {
    return this.encodeNumber(data);
  }

  if (Encoding.isString(data)) {
    return this.encodeString(data);
  }

  if (Encoding.isBoolean(data)) {
    return this.encodeBoolean(data);
  }

  if (Encoding.isArray(data)) {
    return this.encodeArray(data);
  }

  if (Encoding.isObject(data)) {
    return this.encodeObject(data);
  }

  return Maybe.Nothing();
}

module.exports = Encoding;