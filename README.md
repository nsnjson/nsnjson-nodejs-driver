# NSNJSON Node.js Driver ![build](https://circleci.com/gh/nsnjson/nsnjson-nodejs-driver/tree/develop.svg?style=shield&circle-token=1859fd68de67bc039fc6a6d1cf912cd6f052eab4)
## NSNJSON - Not So Normal JSON

![nsnjson_logo](https://raw.githubusercontent.com/wiki/nsnjson/nsnjson-driver/images/nsnjson_logo.png)

## Why?

Have you ever think about JSON with only 4 types: **number**, **string**, **array**, **object**? :)

What if your programming language or some another ecosystem doesn't support **null** or **true**/**false** as a types or a special values?

If it is your case then NSNJSON comes to help you! :)

The NSNJSON operates only 4 types - **number**, **string**, **array**, **object**!

Also, it defines types mapping table:

| JSON type    | null   | number | string | true   | false  | array  | object |
|:-------------|:------:|:------:|:------:|:------:|:------:|:------:|:------:|
| NSNJSON type | 0      | 1      | 2      | 3      | 3      | 4      | 5      |


## How?

For every JSON type NSNJSON defines special presentation which is absolutely valid JSON.

NSNJSON presentation is always JSON object.

Such object always contains field **"t"** (which means **type** of source JSON type).

Also, for all JSON types except **null** the object always contains field **"v"** (which means **value** of source JSON type).

JSON object field has a name. So, NSNJSON saves this information in field **"n"** (which means **name** of field JSON object).

More info on <a href="https://github.com/nsnjson/nsnjson-driver">NSNJSON Driver</a> page.

## Install

NSNJSON Node.js Driver is now available through NPM. So,

```npm install nsnjson-driver```

## Usage

The driver uses [**data.maybe**](https://github.com/folktale/data.maybe) as a wrapper for encoding / decoding results.
```javascript
var nsnjson = require('nsnjson-driver');

var data = null;

var presentationMaybe = nsnjson.encode(data);

console.log(presentationMaybe);
// Maybe { value: { "t": 0 } }

console.log(nsnjson.decode(presentationMaybe.get()));
// Maybe { value: null }
```

## Custom rules

You can define your own rules for JSON encoding/decoding.

Just pass custom rules as an argument to related functions:
- nsnjson.driver @ encode(JSON, options)
- nsnjson.driver @ decode(NSNJSON, options)
- nsnjson.encoder @ encode(JSON, options)
- nsnjson.decoder @ decode(NSNJSON, options)

Example:
```javascript
var Maybe = require('data.maybe');

var nsnjson = require('nsnjson-driver');

var data = 1007;

var presentationMaybe = nsnjson.encode(data, {
  'number': function(value) {
    return Maybe.Just(['number', value]);
  }
});

console.log(presentationMaybe);

// Maybe { value: [ "number", 1007 ] }

console.log(nsnjson.decode(presentationMaybe.get(), {
  'type': function(presentation) {
    return Maybe.Just(presentation[0]);
  },
  'number': function(presentation) {
    return Maybe.Just(presentation[1]);
  }
}));

// Maybe { value: 1007 }
```