var Types = require('./nsnjson.types');

function encodeNull() {
  return {
    t: Types.NULL
  };
};

function encodeBoolean(value) {
  return {
    t: Types.BOOLEAN,
    v: ~~value
  };
};

function encodeNumber(value) {
  return {
    t: Types.NUMBER,
    v: value
  };
};

function encodeString(value) {
  return {
    t: Types.STRING,
    v: value
  };
}; 

function encodeArray(array) {
  var encodedItems = [];

  for (var i = 0, size = array.length; i < size; i++) {
    var encodedItem = encode(array[i]);

    encodedItems.push(encodedItem);
  }

  return {
    t: Types.ARRAY,
    v: encodedItems
  };
};

function encodeObject(object) {
  var encodedFields = [];

  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      var encodedField = encode(object[key]);

      encodedFields.push({
        n: key,
        t: encodedField.t,
        v: encodedField.v
      });
    }
  }

  return {
    t: Types.OBJECT,
    v: encodedFields
  };
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

  throw 'Unknown type ' + JSON.stringify({value: value, type: valueType});
};

module.exports = {
  encode: encode
};
