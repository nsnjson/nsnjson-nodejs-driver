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

function encode(value) {
  if (value == null) {
    return encodeNull();
  }

  var valueType = typeof(value);

  if (valueType == 'boolean') {
    return encodeBoolean(value);
  }

  if (valueType == 'number') {
    return encodeNumber(value);
  }

  if (valueType == 'string') {
    return encodeString(value);
  }

  if (value instanceof Array) {
    return encodeArray(value);
  }

  if (value instanceof Object) {
    return encodeObject(value);
  }

  throw 'Unknown type ' + JSON.stringify({value: value, type: valueType});
};

module.exports = {
  encode: encode
};
