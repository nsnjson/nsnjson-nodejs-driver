var Maybe = require('data.maybe');

var Encoding = require('./nsnjson.encoding');

var Format = require('./nsnjson.format');

function ObjectStyleEncoding() {}

ObjectStyleEncoding.prototype = Object.create(Encoding.prototype);

ObjectStyleEncoding.prototype.encodeNull = function() {
  return Maybe.Just({});
}

ObjectStyleEncoding.prototype.encodeNumber = function(value) {
  return Maybe.Just({
    t: Format.TYPE_MARKER_NUMBER,
    v: value
  });
}

ObjectStyleEncoding.prototype.encodeString = function(value) {
  return Maybe.Just({
    t: Format.TYPE_MARKER_STRING,
    v: value
  });
}

ObjectStyleEncoding.prototype.encodeBoolean = function(value) {
  return Maybe.Just({
    t: Format.TYPE_MARKER_BOOLEAN,
    v: ~~value
  });
}

ObjectStyleEncoding.prototype.encodeArray = function(array) {
  var itemsPresentation = [];

  for (var i = 0, size = array.length; i < size; i++) {
    var itemPresentationMaybe = this.encode(array[i]);

    if (itemPresentationMaybe.isJust) {
      var itemPresentation = itemPresentationMaybe.get();

      itemsPresentation.push(itemPresentation);
    }
  }

  return Maybe.Just({
    t: Format.TYPE_MARKER_ARRAY,
    v: itemsPresentation
  });
}

ObjectStyleEncoding.prototype.encodeObject = function(object) {
  var fieldsPresentation = [];

  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      var valuePresentationMaybe = this.encode(object[key]);

      if (valuePresentationMaybe.isJust) {
        var valuePresentation = valuePresentationMaybe.get();

        var fieldPresentation = {
          n: key
        };

        if (valuePresentation.hasOwnProperty('t')) {
          fieldPresentation.t = valuePresentation.t;
        }

        if (valuePresentation.hasOwnProperty('v')) {
          fieldPresentation.v = valuePresentation.v;
        }

        fieldsPresentation.push(fieldPresentation);
      }
    }
  }

  return Maybe.Just({
    t: Format.TYPE_MARKER_OBJECT,
    v: fieldsPresentation
  });
}

module.exports = ObjectStyleEncoding;