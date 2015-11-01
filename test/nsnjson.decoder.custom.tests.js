var Assert = require('assert');

var Decoder = require('../src/nsnjson.decoder');

var Types = require('../src/nsnjson.types');

var Maybe = require('data.maybe');

describe('Decoder @ decode (custom)', function() {

  var decoderOptions = {
    'type': function(presentation) {
      return Maybe.Just(presentation[0]);
    }
  };

  decoderOptions[Types.NULL] = function(presentation) {
    return Maybe.Just(null);
  }

  decoderOptions[Types.NUMBER] = function(presentation) {
    return Maybe.Just(presentation[1]);
  }

  decoderOptions[Types.STRING] = function(presentation) {
    return Maybe.Just(presentation[1]);
  }

  decoderOptions[Types.BOOLEAN] = function(presentation) {
    if (presentation[1] == 1) {
      return Maybe.Just(true);
    }

    if (presentation[1] == 0) {
      return Maybe.Just(false);
    }

    return Maybe.Nothing();
  }

  decoderOptions[Types.ARRAY] = function(presentation) {
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
  }

  decoderOptions[Types.OBJECT] = function(presentation) {
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

  function testDecoding(name, data, presentation) {
    it(name, function() {
      var actualDataMaybe = Decoder.decode(presentation, decoderOptions);

      Assert.equal(actualDataMaybe.isJust, true);

      Assert.deepEqual(data, actualDataMaybe.get());
    });
  }

  testDecoding('null',
    null,

    ['null']
  );

  testDecoding('number / int',
    2015,

    ['number', 2015]
  );

  testDecoding('number / double',
    10.26,

    ['number', 10.26]
  );

  testDecoding('string / empty',
    '',

    ['string', '']
  );

  testDecoding('string',
    'nsnjson',

    ['string', 'nsnjson']
  );

  testDecoding('boolean / true',
    true,

    ['boolean', 1]
  );

  testDecoding('boolean / false',
    false,

    ['boolean', 0]
  );

  testDecoding('array / empty',
    [],

    ['array', []]
  );

  testDecoding('array',
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

  testDecoding('object / empty',
    {},

    ['object', []]
  );

  testDecoding('object',
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