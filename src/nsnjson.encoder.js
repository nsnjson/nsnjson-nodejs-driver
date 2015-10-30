var Maybe = require('data.maybe');

var Format = require('./nsnjson.format');

function encodeNull(context) {
  return Maybe.Just({
    t: Format.TYPE_MARKER_NULL
  });
};

function encodeBoolean(context, value) {
  return Maybe.Just({
    t: Format.TYPE_MARKER_BOOLEAN,
    v: ~~value
  });
};

function encodeNumber(context, value) {
  return Maybe.Just({
    t: Format.TYPE_MARKER_NUMBER,
    v: value
  });
};

function encodeString(context, value) {
  return Maybe.Just({
    t: Format.TYPE_MARKER_STRING,
    v: value
  });
}; 

function encodeArray(context, array) {
  var encodedItems = [];

  for (var i = 0, size = array.length; i < size; i++) {
    var encodedItemMaybe = encode(context, array[i]);

    if (encodedItemMaybe.isJust) {
      var encodedItem = encodedItemMaybe.get();

      encodedItems.push(encodedItem);
    }
  }

  return Maybe.Just({
    t: Format.TYPE_MARKER_ARRAY,
    v: encodedItems
  });
};

function encodeObject(context, object) {
  var encodedFields = [];

  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      var encodedValueMaybe = encode(context, object[key]);

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
    t: Format.TYPE_MARKER_OBJECT,
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

function encode(context, value) {
  var resolvers = context.resolvers;

  for (var resolverName in resolvers) {
    if (resolvers.hasOwnProperty(resolverName)) {
      var resolver = resolvers[resolverName];

      if (resolver.checker(value)) {
        return resolver.encoder(context, value);
      }
    }
  }

  return Maybe.Nothing();
};

module.exports = {
  encode: function(value, customResolvers) {
    var context = {
      resolvers: {
        'null': {
          checker: isNull,
          encoder: encodeNull
        },
        'number': {
          checker: isNumber,
          encoder: encodeNumber
        },
        'string': {
          checker: isString,
          encoder: encodeString
        },
        'boolean': {
          checker: isBoolean,
          encoder: encodeBoolean
        },
        'array': {
          checker: isArray,
          encoder: encodeArray
        },
        'object': {
          checker: isObject,
          encoder: encodeObject
        }
      }
    };

    if (customResolvers && (customResolvers instanceof Object)) {
      function installCustomResolver(resolverName) {
        if (context.resolvers.hasOwnProperty(resolverName) && customResolvers.hasOwnProperty(resolverName)) {
          var customResolver = customResolvers[resolverName];

          if (customResolver instanceof Object) {
            if (customResolver.hasOwnProperty('checker')) {
              var customResolverChecker = customResolver.checker;

              if (customResolverChecker instanceof Function) {
                context.resolvers[resolverName].checker = customResolver.checker;
              }
            }

            if (customResolver.hasOwnProperty('encoder')) {
              var customResolverChecker = customResolver.encoder;

              if (customResolverChecker instanceof Function) {
                context.resolvers[resolverName].encoder = customResolver.encoder;
              }
            }
          }
        }
      }

      installCustomResolver('null');
      installCustomResolver('number');
      installCustomResolver('string');
      installCustomResolver('boolean');
      installCustomResolver('array');
      installCustomResolver('object');
    }

    return encode(context, value);
  }
};