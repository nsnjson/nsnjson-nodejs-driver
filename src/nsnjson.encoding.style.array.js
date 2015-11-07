var Maybe = require('data.maybe');

var Encoding = require('./nsnjson.encoding');

var Format = require('./nsnjson.format');

function ArrayStyleEncoding() {}

ArrayStyleEncoding.prototype = Object.create(Encoding.prototype);

ArrayStyleEncoding.prototype.encodeNull = function() {
  return Maybe.Just([]);
}

ArrayStyleEncoding.prototype.encodeNumber = function(value) {
  return Maybe.Just([Format.TYPE_MARKER_NUMBER, value]);
}

ArrayStyleEncoding.prototype.encodeString = function(value) {
  return Maybe.Just([Format.TYPE_MARKER_STRING, value]);
}

ArrayStyleEncoding.prototype.encodeBoolean = function(value) {
  return Maybe.Just([Format.TYPE_MARKER_STRING, ~~value]);
}

ArrayStyleEncoding.prototype.encodeArray = function(array) {
  var presentation = [Format.TYPE_MARKER_ARRAY];

  for (var i = 0, size = array.length; i < size; i++) {
    var itemPresentationMaybe = this.encode(array[i]);

    if (itemPresentationMaybe.isJust) {
      var itemPresentation = itemPresentationMaybe.get();

      presentation.push(itemPresentation);
    }
  }

  return Maybe.Just(presentation);
}

ArrayStyleEncoding.prototype.encodeObject = function(object) {
  var presentation = [Format.TYPE_MARKER_OBJECT];

  for (var name in object) {
    if (object.hasOwnProperty(name)) {
      var valuePresentationMaybe = this.encode(object[name]);

      if (valuePresentationMaybe.isJust) {
        var valuePresentation = valuePresentationMaybe.get();

        var fieldPresentation = [name, valuePresentation];

        presentation.push(fieldPresentation);
      }
    }
  }

  return Maybe.Just(presentation);
}

module.exports = ArrayStyleEncoding;