var Maybe = require('data.maybe');

var Format = require('./nsnjson.format');

function decodeNull(presentation) {
  return Maybe.Just(null);
}

function decodeBoolean(presentation) {
  if (presentation.v == 1) {
    return Maybe.Just(true);
  }

  if (presentation.v == 0) {
    return Maybe.Just(false);
  }

  return Maybe.Nothing();
};

function decodeNumber(presentation) {
  return Maybe.Just(presentation.v);
};

function decodeString(presentation) {
  return Maybe.Just(presentation.v);
};

function decodeArray(presentation) {
  var array = [];

  var encodedItems = presentation.v;

  for (var i = 0, size = encodedItems.length; i < size; i++) {
    var encodedItem = encodedItems[i];

    var itemMaybe = decode(encodedItem);

    if (itemMaybe.isJust) {
      var item = itemMaybe.get();

      array.push(item);
    }
  }

  return Maybe.Just(array);
};

function decodeObject(presentation) {
  var object = {};

  var encodedFields = presentation.v;

  for (var i = 0, size = encodedFields.length; i < size; i++) {
    var encodedField = encodedFields[i];

    var fieldValueMaybe = decode(encodedField);

    if (fieldValueMaybe.isJust) {
      var value = fieldValueMaybe.get();

      var name = encodedField.n;

      object[name] = value;
    }
  }

  return Maybe.Just(object);
};

function checkerByType(type) {
  return function(presentation) {
    return presentation.t == type;
  };
};

var resolvers = [
  {
    checker: checkerByType(Format.TYPE_MARKER_NULL),
    decoder: decodeNull
  },
  {
    checker: checkerByType(Format.TYPE_MARKER_BOOLEAN),
    decoder: decodeBoolean
  },
  {
    checker: checkerByType(Format.TYPE_MARKER_NUMBER),
    decoder: decodeNumber
  },
  {
    checker: checkerByType(Format.TYPE_MARKER_STRING),
    decoder: decodeString
  },
  {
    checker: checkerByType(Format.TYPE_MARKER_ARRAY),
    decoder: decodeArray
  },
  {
    checker: checkerByType(Format.OBJECT),
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

  return Maybe.Nothing();
};

module.exports = {
  decode: decode
};
