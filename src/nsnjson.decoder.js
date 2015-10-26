var Types = require('./nsnjson.types.js');

function type(presentation) {
  return presentation.t;
}

function decodeNull(presentation) {
  if (type(presentation) == Types.NULL) {
    return null;
  }
}

function decodeBoolean(presentation) {
  if (type(presentation) == Types.BOOLEAN) {
    return presentation.v != 0;
  }
};

function decodeNumber(presentation) {
  if (type(presentation) == Types.NUMBER) {
    return presentation.v;
  }
};

function decodeString(presentation) {
  if (type(presentation) == Types.STRING) {
    return presentation.v;
  }
};

function decodeArray(presentation) {
  if (type(presentation) == Types.ARRAY) {
    var array = [];

    var encodedItems = presentation.v;

    for (var i = 0, size = encodedItems.length; i < size; i++) {
      var encodedItem = encodedItems[i];

      var item = decode(encodedItem);

      array.push(item);
    }

    return array;
  }
};

function decodeObject(presentation) {
  if (type(presentation) == Types.OBJECT) {
    var object = {};

    var encodedFields = presentation.v;

    for (var i = 0, size = encodedFields.length; i < size; i++) {
      var encodedField = encodedFields[i];

      var name = encodedField.n;

      var value = decode(encodedField);

      object[name] = value;
    }

    return object;
  }
};

function decode(presentation) {
  var presentationType = type(presentation);

  if (presentationType == Types.NULL) {
    return decodeNull(presentation);
  }
  else if (presentationType == 'boolean') {
    return decodeBoolean(presentation);
  }
  else if (presentationType == 'number') {
    return decodeNumber(presentation);
  }
  else if (presentationType == 'string') {
    return decodeString(presentation);
  }
  else if (presentationType == 'array') {
    return decodeArray(presentation);
  }
  else if (presentationType == 'object') {
    return decodeObject(presentation);
  }
  else {
    throw 'Unknown type ' + JSON.stringify({presentation: presentation, type: presentation.t});
  }
};

module.exports = {
  decode: decode
};
