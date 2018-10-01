# babel-plugin-transform-ts-import

[![Build Status](https://travis-ci.com/ruslankhh/babel-plugin-transform-ts-import.svg?branch=master)](https://travis-ci.com/ruslankhh/babel-plugin-transform-ts-import)

TypeScript in JavaScript imports resolver.

## Examples

```js
// Before
import Hello from '.hello.ts';

// After
var _ref = function (exports) {
  Object.defineProperty(exports, \\"__esModule\\", {
    value: true
  });
  exports.default = void 0;

  var Hello = function Hello() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (!props.name) {
      props.name = 'World';
    }

    return ''.concat('Hello, ').concat(props.name, '!');
  };

  var _default = Hello;
  exports.default = _default;
  return exports;
}({}),
    Hello = _ref.default;
```

## Requirements

- Babel 7+
- TypeScript 2+

## Installation

```bash
npm i -D babel-plugin-transform-ts-import
```

## Usage

`.babelrc`

``` json
{
  "plugins": [
    ["transform-ts-import", {
        // .babelrc for inner ts transform. Default:
        "presets": [
            "@babel/preset-env",
            "@babel/preset-typescript"
        ],
        "generatorOpts": {
            "comments": false,
            "quotes": "single",
            "jsescOption": { "quotes": "single" }
        },
        "ast": true,
        "babelrc": false
    }]
  ]
}
```

## Options

Look at https://babeljs.io/docs/en/options.
