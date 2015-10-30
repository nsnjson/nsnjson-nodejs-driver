var Assert = require('assert');

var Decoder = require('../src/nsnjson.decoder');

var Maybe = require('data.maybe');

describe('Decoder @ decode (custom)', function() {

  function typeDetector(presentation, typeName) {
    return presentation[0] == typeName;
  }

  var customResolvers = {
    'null': {
      checker: function(presentation) { return typeDetector(presentation, 'null'); },
      decoder: function(context, presentation) { return Maybe.Just(null); }
    },
    'number': {
      checker: function(presentation) { return typeDetector(presentation, 'number'); },
      decoder: function(context, presentation) { return Maybe.Just(presentation[1]); }
    },
    'string': {
      checker: function(presentation) { return typeDetector(presentation, 'string'); },
      decoder: function(context, presentation) { return Maybe.Just(presentation[1]); }
    },
    'boolean': {
      checker: function(presentation) { return typeDetector(presentation, 'boolean'); },
      decoder: function(context, presentation) {
        if (presentation[1] == 1) {
          return Maybe.Just(true);
        }

        if (presentation[1] == 0) {
          return Maybe.Just(false);
        }

        return Maybe.Nothing();
      }
    },
    'array': {
      checker: function(presentation) { return typeDetector(presentation, 'array'); },
      decoder: function(context, presentation) {
        var array = [];

        var encodedItems = presentation[1];

        for (var i = 0, size = encodedItems.length; i < size; i++) {
          var encodedItem = encodedItems[i];

          var itemMaybe = Decoder.decode(encodedItem, customResolvers);

          if (itemMaybe.isJust) {
            var item = itemMaybe.get();

            array.push(item);
          }
        }

        return Maybe.Just(array);
      }
    },
    'object': {
      checker: function(presentation) { return typeDetector(presentation, 'object'); },
      decoder: function(context, presentation) {
        var object = {};

        var encodedFields = presentation[1];

        for (var i = 0, size = encodedFields.length; i < size; i++) {
          var encodedField = encodedFields[i];

          var fieldValueMaybe = Decoder.decode(encodedField, customResolvers);

          if (fieldValueMaybe.isJust) {
            var value = fieldValueMaybe.get();

            var name = encodedField[encodedField.length - 1];

            object[name] = value;
          }
        }

        return Maybe.Just(object);
      }
    }
  };

  function testDecoding(value, presentation) {
    it(JSON.stringify(value), function() {
      var actualValueMaybe = Decoder.decode(presentation, customResolvers);

      Assert.equal(actualValueMaybe.isJust, true);

      var actualValue = actualValueMaybe.get();

      Assert.deepEqual(value, actualValue);
    });
  }

  testDecoding(
    null,

    ['null']
  );

  testDecoding(
    1007,

    ['number', 1007]
  );

  testDecoding(
    'nsnjson',

    ['string', 'nsnjson']
  );

  testDecoding(
    true,

    ['boolean', 1]
  );

  testDecoding(
    false,

    ['boolean', 0]
  );

  testDecoding(
    [],

    ['array', []]
  );

  testDecoding(
    [
      null,
      1007,
      'nsnjson',
      true,
      false
    ],

    ['array', [
      ['null'],
      ['number', 1007],
      ['string', 'nsnjson'],
      ['boolean', 1],
      ['boolean', 0]
    ]]
  );

  testDecoding(
    {},

    ['object', []]
  );

  testDecoding(
    {
      null_field: null,
      number_field: 1007,
      string_field: 'nsnjson',
      true_field: true,
      false_field: false
    },

    ['object', [
      ['null', 'null_field'],
      ['number', 1007, 'number_field'],
      ['string', 'nsnjson', 'string_field'],
      ['boolean', 1, 'true_field'],
      ['boolean', 0, 'false_field']
    ]]
  );

});