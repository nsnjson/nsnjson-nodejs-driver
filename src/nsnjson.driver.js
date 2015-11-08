var Maybe = require('data.maybe');

var Types = require('./nsnjson.types');

var Format = require('./nsnjson.format');

var Encoder = require('./nsnjson.encoder');

var Decoder = require('./nsnjson.decoder');

var Encoding = require('./nsnjson.encoding');
var Decoding = require('./nsnjson.decoding');

var ArrayStyleEncoding = require('./nsnjson.encoding.style.array');
var ArrayStyleDecoding = require('./nsnjson.decoding.style.array');

var ObjectStyleEncoding = require('./nsnjson.encoding.style.object');
var ObjectStyleDecoding = require('./nsnjson.decoding.style.object');

function Driver() {}

Driver.encode = function(data, customEncoders) {
  return Encoder.encode(data, customEncoders);
}

Driver.decode = function(data, customDecoders) {
  return Decoder.decode(data, customDecoders);
}

Driver.encoderWithArrayStyle = function(customEncoders) {
  return Encoding.customize(ArrayStyleEncoding, customEncoders);
}

Driver.encoderWithObjectStyle = function(customEncoders) {
  return Encoding.customize(ObjectStyleEncoding, customEncoders);
}

Driver.decoderWithArrayStyle = function(customDecoders) {
  return Decoding.customize(ArrayStyleDecoding, customDecoders);
}

Driver.decoderWithObjectStyle = function(customDecoders) {
  return Decoding.customize(ObjectStyleDecoding, customDecoders);
}

Driver.withArrayStyle = function(customizations) {
  var customEncoders = Maybe.fromNullable(customizations).chain(function($) { return Maybe.fromNullable($.encoders); }).getOrElse({});
  var customDecoders = Maybe.fromNullable(customizations).chain(function($) { return Maybe.fromNullable($.decoders); }).getOrElse({});

  var encoder = Driver.encoderWithArrayStyle(customEncoders);
  var decoder = Driver.decoderWithArrayStyle(customDecoders);

  return {
    encode: function(data) {
      return encoder.encode(data);
    },
    decode: function(presentation) {
      return decoder.decode(presentation);
    }
  };
}

Driver.withObjectStyle = function(customizations) {
  var customEncoders = Maybe.fromNullable(customizations).chain(function($) { return Maybe.fromNullable($.encoders); }).getOrElse({});
  var customDecoders = Maybe.fromNullable(customizations).chain(function($) { return Maybe.fromNullable($.decoders); }).getOrElse({});

  var encoder = Driver.encoderWithObjectStyle(customEncoders);
  var decoder = Driver.decoderWithObjectStyle(customDecoders);

  return {
    encode: function(data) {
      return encoder.encode(data);
    },
    decode: function(presentation) {
      return decoder.decode(presentation);
    }
  };
}

/**
 * @module Driver
 */
module.exports = Driver;