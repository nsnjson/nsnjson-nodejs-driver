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

function checkerByType(type) {
  return function(presentation) {
    return presentation.t == type;
  };
};

var resolvers = [
  {
    checker: checkerByType(Types.NULL),
    decoder: decodeNull
  },
  {
    checker: checkerByType(Types.BOOLEAN),
    decoder: decodeBoolean
  },
  {
    checker: checkerByType(Types.NUMBER),
    decoder: decodeNumber
  },
  {
    checker: checkerByType(Types.STRING),
    decoder: decodeString
  },
  {
    checker: checkerByType(Types.ARRAY),
    decoder: decodeArray
  },
  {
    checker: checkerByType(Types.OBJECT),
    decoder: decodeObject
  }
];

var resolversCount = resolvers.length;

function decode(presentation) {
  for (var i = 0; i < resolversCount; i++) {
    var resolver = resolvers[i];

    if (resolver.checker(presentation)) {
      return resolver.decoder(presentation);
    }
  }

  throw 'Unknown type ' + JSON.stringify({presentation: presentation, type: presentation.t});
};

module.exports = {
  decode: decode
};
