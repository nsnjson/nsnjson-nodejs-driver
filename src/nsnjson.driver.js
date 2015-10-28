module.exports = {
  encoder: require('./nsnjson.encoder'),
  decoder: require('./nsnjson.decoder'),
  encode: require('./nsnjson.encoder').encode,
  decode: require('./nsnjson.decoder').decode
};
