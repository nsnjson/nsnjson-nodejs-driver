var Assert = require('assert');

var Encoder = require('../src/nsnjson.encoder');

var Maybe = require('data.maybe');

describe('Encoder @ encode (custom)', function() {

  function typeDetector(value, typeName) {
    return Object.prototype.toString.call(value).toLowerCase().indexOf(typeName) != (-1);
  }

  var customResolvers = {
    'null': {
      checker: function(value) { return typeDetector(value, 'null'); },
      encoder: function(context, value) { return Maybe.Just(['null']); }
    },
    'number': {
      checker: function(value) { return typeDetector(value, 'number'); },
      encoder: function(context, value) { return Maybe.Just(['number', value]); }
    },
    'string': {
      checker: function(value) { return typeDetector(value, 'string'); },
      encoder: function(context, value) { return Maybe.Just(['string', value]); }
    },
    'boolean': {
      checker: function(value) { return typeDetector(value, 'boolean'); },
      encoder: function(context, value) { return Maybe.Just(['boolean', ~~value]); }
    },
    'array': {
      checker: function(value) { return typeDetector(value, 'array'); },
      encoder: function(context, array) {
        var encodedItems = [];

        for (var i = 0, size = array.length; i < size; i++) {
          var encodedItemMaybe = Encoder.encode(array[i], customResolvers);

          if (encodedItemMaybe.isJust) {
            var encodedItem = encodedItemMaybe.get();

            encodedItems.push(encodedItem);
          }
        }

        return Maybe.Just(['array', encodedItems]);
      }
    },
    'object': {
      checker: function(value) { return typeDetector(value, 'object'); },
      encoder: function(context, object) {
        var encodedFields = [];

        for (var name in object) {
          if (object.hasOwnProperty(name)) {
            var encodedValueMaybe = Encoder.encode(object[name], customResolvers);

            if (encodedValueMaybe.isJust) {
              var encodedValue = encodedValueMaybe.get();

              var encodedField = encodedValue.slice();

              encodedField.push(name);

              encodedFields.push(encodedField);
            }
          }
        }

        return Maybe.Just(['object', encodedFields]);
      }
    }
  };

  function testEncoding(value, presentation) {
    it(JSON.stringify(value), function() {
      var actualPresentationMaybe = Encoder.encode(value, customResolvers);

      Assert.equal(actualPresentationMaybe.isJust, true);

      var actualPresentation = actualPresentationMaybe.get();

      Assert.deepEqual(presentation, actualPresentation);
    });
  };

  testEncoding(
    null,

    ['null']
  );

  testEncoding(
    1007,

    ['number', 1007]
  );

  testEncoding(
    'nsnjson',

    ['string', 'nsnjson']
  );

  testEncoding(
    true,

    ['boolean', 1]
  );

  testEncoding(
    false,

    ['boolean', 0]
  );

  testEncoding(
    [],

    ['array', []]
  );

  testEncoding(
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

  testEncoding(
    {},

    ['object', []]
  );

  testEncoding(
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