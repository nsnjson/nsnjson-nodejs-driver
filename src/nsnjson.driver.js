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

/**
 * @module Driver
 */
module.exports = {
  Types: Types,

  Format: Format,

  /**
   * @param {JSON} data any JSON data
   * @param {Object} options Encoder options
   */
  encode: function(data, options) {
    return Encoder.encode(data, options);
  },

  /**
   * @param {JSON} presentation NSNJSON presentation of JSON
   * @param {Object} options Decoder options
   */
  decode: function(presentation, options) {
    return Decoder.decode(presentation, options);
  },

  encoderWithArrayStyle: function(customEncoders) {
    return Encoding.customize(ArrayStyleEncoding, customEncoders);
  },

  decoderWithArrayStyle: function(customDecoders) {
    return Decoding.customize(ArrayStyleDecoding, customDecoders);
  },

  encoderWithObjectStyle: function(customEncoders) {
    return Encoding.customize(ObjectStyleEncoding, customEncoders);
  },

  decoderWithObjectStyle: function(customDecoders) {
    return Decoding.customize(ObjectStyleDecoding, customDecoders);
  }
};