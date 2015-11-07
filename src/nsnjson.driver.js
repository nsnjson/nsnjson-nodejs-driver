var Encoder = require('./nsnjson.encoder');

var Decoder = require('./nsnjson.decoder');

var Encoding = require('./nsnjson.encoding');

var ArrayStyleEncoding = require('./nsnjson.encoding.style.array');

var ObjectStyleEncoding = require('./nsnjson.encoding.style.object');

/**
 * @module Driver
 */
module.exports = {
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

  encoderWithArrayStyle: function(options) {
    return Encoding.customize(ArrayStyleEncoding, options);
  },

  encoderWithObjectStyle: function(options) {
    return Encoding.customize(ObjectStyleEncoding, options);
  }
};