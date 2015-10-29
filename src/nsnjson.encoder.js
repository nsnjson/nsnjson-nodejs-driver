var Maybe = require('data.maybe');

var Types = require('./nsnjson.types');

function encodeNull() {
  return Maybe.Just({
    t: Types.NULL
  });
};

function encodeBoolean(value) {
  return Maybe.Just({
    t: Types.BOOLEAN,
    v: ~~value
  });
};

function encodeNumber(value) {
  return Maybe.Just({
    t: Types.NUMBER,
    v: value
  });
};

function encodeString(value) {
  return Maybe.Just({
    t: Types.STRING,
    v: value
  });
}; 

function encodeArray(array) {
  var encodedItems = [];

  for (var i = 0, size = array.length; i < size; i++) {
    var encodedItemMaybe = encode(array[i]);

    if (encodedItemMaybe.isJust) {
      var encodedItem = encodedItemMaybe.get();

      encodedItems.push(encodedItem);
    }
  }

  return Maybe.Just({
    t: Types.ARRAY,
    v: encodedItems
  });
};

function encodeObject(object) {
  var encodedFields = [];

  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      var encodedValueMaybe = encode(object[key]);

      if (encodedValueMaybe.isJust) {
        var encodedValue = encodedValueMaybe.get();

        var encodedField = {
          n: key,
          t: encodedValue.t
        };

        if (encodedValue.hasOwnProperty('v')) {
          encodedField.v = encodedValue.v;
        }

        encodedFields.push(encodedField);
      }
    }
  }

  return Maybe.Just({
    t: Types.OBJECT,
    v: encodedFields
  });
};

function isNull(value) {
  return (value == null);
};

function isBoolean(value) {
  return (typeof(value) == 'boolean') || (value instanceof Boolean);
};

function isNumber(value) {
  return (typeof(value) == 'number') || (value instanceof Number);
};

function isString(value) {
  return (typeof(value) == 'string') || (value instanceof String);
};

function isArray(value) {
  return (value instanceof Array);
};

function isObject(value) {
  return (value instanceof Object);
};

var resolvers = [
  {
    checker: isNull,
    encoder: encodeNull
  },
  {
    checker: isBoolean,
    encoder: encodeBoolean
  },
  {
    checker: isNumber,
    encoder: encodeNumber
  },
  {
    checker: isString,
    encoder: encodeString
  },
  {
    checker: isArray,
    encoder: encodeArray
  },
  {
    checker: isObject,
    encoder: encodeObject
  }
];

var resolversCount = resolvers.length;

function encode(value) {
  for (var i = 0; i < resolversCount; i++) {
    var resolver = resolvers[i];

    if (resolver.checker(value)) {
      return resolver.encoder(value);
    }
  }

  return Maybe.Nothing();
};

module.exports = {
  encode: encode
};
