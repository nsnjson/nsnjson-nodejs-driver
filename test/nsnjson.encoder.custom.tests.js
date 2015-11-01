var Assert = require('assert');

var Encoder = require('../src/nsnjson.encoder');

var Maybe = require('data.maybe');

describe('Encoder @ encode (custom)', function() {

  function typeDetector(value, typeName) {
    return Object.prototype.toString.call(value).toLowerCase().indexOf(typeName) != (-1);
  }

  var customResolvers = {
    'null': function() { return Maybe.Just(['null']); },
    'number': function(value) { return Maybe.Just(['number', value]); },
    'string': function(value) { return Maybe.Just(['string', value]); },
    'boolean': function(value) { return Maybe.Just(['boolean', ~~value]); },
    'array': function(array) {
        var itemsPresentation = [];

        for (var i = 0, size = array.length; i < size; i++) {
          var itemPresentationMaybe = this.encode(array[i]);

          if (itemPresentationMaybe.isJust) {
            var itemPresentation = itemPresentationMaybe.get();

            itemsPresentation.push(itemPresentation);
          }
        }

        return Maybe.Just(['array', itemsPresentation]);
    },
    'object': function(object) {
        var fieldsPresentation = [];

        for (var name in object) {
          if (object.hasOwnProperty(name)) {
            var valuePresentationMaybe = this.encode(object[name]);

            if (valuePresentationMaybe.isJust) {
              var valuePresentation = valuePresentationMaybe.get();

              var fieldPresentation = valuePresentation.slice();

              fieldPresentation.push(name);

              fieldsPresentation.push(fieldPresentation);
            }
          }
        }

        return Maybe.Just(['object', fieldsPresentation]);
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