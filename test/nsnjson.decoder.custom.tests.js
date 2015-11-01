var Assert = require('assert');

var Decoder = require('../src/nsnjson.decoder');

var Maybe = require('data.maybe');

describe('Decoder @ decode (custom)', function() {

  function typeDetector(presentation, typeName) {
    return presentation[0] == typeName;
  }

  var customResolvers = {
    'type': function(presentation) {
      return Maybe.Just(presentation[0]);
    },
    'null': function(presentation) {
      return Maybe.Just(null);
    },
    'number': function(presentation) {
      return Maybe.Just(presentation[1]);
    },
    'string': function(presentation) {
      return Maybe.Just(presentation[1]);
    },
    'boolean': function(presentation) {
      if (presentation[1] == 1) {
        return Maybe.Just(true);
      }

      if (presentation[1] == 0) {
        return Maybe.Just(false);
      }

      return Maybe.Nothing();
    },
    'array': function(presentation) {
      var array = [];

      var itemsPresentation = presentation[1];

      for (var i = 0, size = itemsPresentation.length; i < size; i++) {
        var itemPresentation = itemsPresentation[i];

        var itemMaybe = this.decode(itemPresentation);

        if (itemMaybe.isJust) {
          var item = itemMaybe.get();

          array.push(item);
        }
      }

      return Maybe.Just(array);
    },
    'object': function(presentation) {
      var object = {};

      var fieldsPresentation = presentation[1];

      for (var i = 0, size = fieldsPresentation.length; i < size; i++) {
        var fieldPresentation = fieldsPresentation[i];

        var name = fieldPresentation[fieldPresentation.length - 1];

        var valueMaybe = this.decode(fieldPresentation);

        if (valueMaybe.isJust) {
          var value = valueMaybe.get();

          object[name] = value;
        }
      }

      return Maybe.Just(object);
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