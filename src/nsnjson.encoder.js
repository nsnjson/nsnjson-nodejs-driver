var Maybe = require('data.maybe');

var Format = require('./nsnjson.format');

var Types = require('./nsnjson.types');

function Encoding() {}

Encoding.isNull = function(json) {
  return (json == null);
}

Encoding.isBoolean = function(json) {
  return (typeof(json) == 'boolean') || (json instanceof Boolean);
}

Encoding.isNumber = function(json) {
  return (typeof(json) == 'number') || (json instanceof Number);
}

Encoding.isString = function(json) {
  return (typeof(json) == 'string') || (json instanceof String);
}

Encoding.isArray = function(json) {
  return (json instanceof Array);
}

Encoding.isObject = function(json) {
  return (json instanceof Object);
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

Encoding.prototype.encode = function(json) {
  if (Encoding.isNull(json)) {
    return this.encodeNull();
  }

  if (Encoding.isNumber(json)) {
    return this.encodeNumber(json);
  }

  if (Encoding.isString(json)) {
    return this.encodeString(json);
  }

  if (Encoding.isBoolean(json)) {
    return this.encodeBoolean(json);
  }

  if (Encoding.isArray(json)) {
    return this.encodeArray(json);
  }

  if (Encoding.isObject(json)) {
    return this.encodeObject(json);
  }

  return Maybe.Nothing();
}

module.exports = {
  encode: function(json, options) {
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

    return encoding.encode(json);
  }
};