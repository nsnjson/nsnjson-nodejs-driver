var Maybe = require('data.maybe');

var Format = require('./nsnjson.format');

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

Encoding.prototype.encodeNull = function() {
  return Maybe.Just({
    t: Format.TYPE_MARKER_NULL
  });
}

Encoding.prototype.encodeNumber = function(value) {
  return Maybe.Just({
    t: Format.TYPE_MARKER_NUMBER,
    v: value
  });
}

Encoding.prototype.encodeString = function(value) {
  return Maybe.Just({
    t: Format.TYPE_MARKER_STRING,
    v: value
  });
}

Encoding.prototype.encodeBoolean = function(value) {
  return Maybe.Just({
    t: Format.TYPE_MARKER_BOOLEAN,
    v: ~~value
  });
}

Encoding.prototype.encodeArray = function(array) {
  var itemsPresentation = [];

  for (var i = 0, size = array.length; i < size; i++) {
    var itemPresentationMaybe = this.encode(array[i]);

    if (itemPresentationMaybe.isJust) {
      var itemPresentation = itemPresentationMaybe.get();

      itemsPresentation.push(itemPresentation);
    }
  }

  return Maybe.Just({
    t: Format.TYPE_MARKER_ARRAY,
    v: itemsPresentation
  });
}

Encoding.prototype.encodeObject = function(object) {
  var fieldsPresentation = [];

  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      var valuePresentationMaybe = this.encode(object[key]);

      if (valuePresentationMaybe.isJust) {
        var valuePresentation = valuePresentationMaybe.get();

        var fieldPresentation = {
          n: key
        };

        if (valuePresentation.hasOwnProperty('t')) {
          fieldPresentation.t = valuePresentation.t;
        }

        if (valuePresentation.hasOwnProperty('v')) {
          fieldPresentation.v = valuePresentation.v;
        }

        fieldsPresentation.push(fieldPresentation);
      }
    }
  }

  return Maybe.Just({
    t: Format.TYPE_MARKER_OBJECT,
    v: fieldsPresentation
  });
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

/**
 * @module Encoder
 */
module.exports = {
  /**
   * @param {JSON} data JSON
   * @param {Object} options Encoder options
   */
  encode: function(data, options) {
    var encodersNames = [Types.NULL, Types.NUMBER, Types.STRING, Types.BOOLEAN, Types.ARRAY, Types.OBJECT];

    var encoding = new Encoding();

    if (options && (options instanceof Object)) {
      for (var i = 0, encodersNamesCount = encodersNames.length; i < encodersNamesCount; i++) {
        var encoderName = encodersNames[i];

        if (options.hasOwnProperty(encoderName)) {
          var customEncoder = options[encoderName];

          if (customEncoder instanceof Function) {
            switch (encoderName) {
              case Types.NULL:    encoding.encodeNull    = customEncoder; break;
              case Types.NUMBER:  encoding.encodeNumber  = customEncoder; break;
              case Types.STRING:  encoding.encodeString  = customEncoder; break;
              case Types.BOOLEAN: encoding.encodeBoolean = customEncoder; break;
              case Types.ARRAY:   encoding.encodeArray   = customEncoder; break;
              case Types.OBJECT:  encoding.encodeObject  = customEncoder; break;
            }
          }
        }
      }
    }

    return encoding.encode(data);
  }
};