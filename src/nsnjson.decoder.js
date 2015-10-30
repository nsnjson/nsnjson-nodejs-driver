var Maybe = require('data.maybe');

var Format = require('./nsnjson.format');

function decodeNull(context) {
  return Maybe.Just(null);
}

function decodeBoolean(context, presentation) {
  if (presentation.v == 1) {
    return Maybe.Just(true);
  }

  if (presentation.v == 0) {
    return Maybe.Just(false);
  }

  return Maybe.Nothing();
};

function decodeNumber(context, presentation) {
  return Maybe.Just(presentation.v);
};

function decodeString(context, presentation) {
  return Maybe.Just(presentation.v);
};

function decodeArray(context, presentation) {
  var array = [];

  var encodedItems = presentation.v;

  for (var i = 0, size = encodedItems.length; i < size; i++) {
    var encodedItem = encodedItems[i];

    var itemMaybe = decode(context, encodedItem);

    if (itemMaybe.isJust) {
      var item = itemMaybe.get();

      array.push(item);
    }
  }

  return Maybe.Just(array);
};

function decodeObject(context, presentation) {
  var object = {};

  var encodedFields = presentation.v;

  for (var i = 0, size = encodedFields.length; i < size; i++) {
    var encodedField = encodedFields[i];

    var fieldValueMaybe = decode(context, encodedField);

    if (fieldValueMaybe.isJust) {
      var value = fieldValueMaybe.get();

      var name = encodedField.n;

      object[name] = value;
    }
  }

  return Maybe.Just(object);
};

function decode(context, presentation) {
  var resolvers = context.resolvers;

  for (var resolverName in resolvers) {
    if (resolvers.hasOwnProperty(resolverName)) {
      var resolver = resolvers[resolverName];

      if (resolver.checker(presentation)) {
        return resolver.decoder(context, presentation);
      }
    }
  }

  return Maybe.Nothing();
};

module.exports = {
  decode: function(presentation) {
    function checkerByType(type) {
      return function(presentation) {
        return presentation.t == type;
      };
    }

    var context = {
      resolvers: {
        'null': {
          checker: checkerByType(Format.TYPE_MARKER_NULL),
          decoder: decodeNull
        },
        'number': {
          checker: checkerByType(Format.TYPE_MARKER_NUMBER),
          decoder: decodeNumber
        },
        'string': {
          checker: checkerByType(Format.TYPE_MARKER_STRING),
          decoder: decodeString
        },
        'boolean': {
          checker: checkerByType(Format.TYPE_MARKER_BOOLEAN),
          decoder: decodeBoolean
        },
        'array': {
          checker: checkerByType(Format.TYPE_MARKER_ARRAY),
          decoder: decodeArray
        },
        'object': {
          checker: checkerByType(Format.TYPE_MARKER_OBJECT),
          decoder: decodeObject
        }
      }
    };

    return decode(context, presentation);
  }
};