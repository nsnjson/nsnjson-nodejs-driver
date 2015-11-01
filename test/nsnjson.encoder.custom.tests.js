var Assert = require('assert');

var Encoder = require('../src/nsnjson.encoder');

var Types = require('../src/nsnjson.types');

var Maybe = require('data.maybe');

describe('Encoder @ encode (custom)', function() {

  var encoderOptions = {};

  encoderOptions[Types.NULL] = function() {
    return Maybe.Just([Types.NULL]);
  }

  encoderOptions[Types.NUMBER] = function(value) {
    return Maybe.Just([Types.NUMBER, value]);
  }

  encoderOptions[Types.STRING] = function(value) {
    return Maybe.Just([Types.STRING, value]);
  }

  encoderOptions[Types.BOOLEAN] = function(value) {
    return Maybe.Just([Types.BOOLEAN, ~~value]);
  }

  encoderOptions[Types.ARRAY] = function(array) {
    var itemsPresentation = [];

    for (var i = 0, size = array.length; i < size; i++) {
      var itemPresentationMaybe = this.encode(array[i]);

      if (itemPresentationMaybe.isJust) {
        var itemPresentation = itemPresentationMaybe.get();

        itemsPresentation.push(itemPresentation);
      }
    }

    return Maybe.Just([Types.ARRAY, itemsPresentation]);
  }

  encoderOptions[Types.OBJECT] = function(object) {
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

    return Maybe.Just([Types.OBJECT, fieldsPresentation]);
  }

  function testEncoding(name, json, presentation) {
    it(name, function() {
      var actualPresentationMaybe = Encoder.encode(json, encoderOptions);

      Assert.equal(actualPresentationMaybe.isJust, true);

      var actualPresentation = actualPresentationMaybe.get();

      Assert.deepEqual(presentation, actualPresentation);
    });
  }

  testEncoding('null',
    null,

    ['null']
  );

  testEncoding('number / int',
    2015,

    ['number', 2015]
  );

  testEncoding('number / double',
    10.26,

    ['number', 10.26]
  );

  testEncoding('string / empty',
    '',

    ['string', '']
  );

  testEncoding('string',
    'nsnjson',

    ['string', 'nsnjson']
  );

  testEncoding('boolean / true',
    true,

    ['boolean', 1]
  );

  testEncoding('boolean / false',
    false,

    ['boolean', 0]
  );

  testEncoding('array / empty',
    [],

    ['array', []]
  );

  testEncoding('array',
    [
      null,
      2015,
      10.26,
      'nsnjson',
      true,
      false
    ],

    ['array', [
      ['null'],
      ['number', 2015],
      ['number', 10.26],
      ['string', 'nsnjson'],
      ['boolean', 1],
      ['boolean', 0]
    ]]
  );

  testEncoding('object / empty',
    {},

    ['object', []]
  );

  testEncoding('object',
    {
      null_field: null,
      int_field: 2015,
      double_field: 10.26,
      string_field: 'nsnjson',
      true_field: true,
      false_field: false
    },

    ['object', [
      ['null', 'null_field'],
      ['number', 2015, 'int_field'],
      ['number', 10.26, 'double_field'],
      ['string', 'nsnjson', 'string_field'],
      ['boolean', 1, 'true_field'],
      ['boolean', 0, 'false_field']
    ]]
  );

});