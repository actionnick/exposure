## Overview

Exposure allows fast image processing in the browser backed by webGL. Right now even with just brightness, contrast, and levels implemented a range of effects can be achieved. Everything from HDR to instagram like filters.

You supply the `img` to be filtered, a 'canvas' for the output, and optional settings json, exposure will draw the result to a canvas.

## Install

```sh
$ npm install --save exposure
```

## Usage

```js
var Exposure = require('exposure');
var json = ...// settings json can be created on the demo page

var exposure = new Exposure(img, canvasNode, json);
exposure.draw();
```

## Image size

Right now if one side of the image is greater than 2500 pixels the image will be resized to fit this constraint. In this case a callback can be provided in order to know when the image resize has completed.

```js
var exposure = new Exposure(img, canvasNode, function(exp) {
  exp.draw();
  // notify app exposure is ready to draw
});
```

Note that this callback gets called everytime regardless of whether or not the image is too large so for consistency you can just provide a callback all the time. 

## Settings JSON

The filter exposure renders is controlled by a json containing all the information in it. You can generate a json by visiting this link. You can also initialize frame without a json and then manipulate it live yourself.

```js
var exposure = new Exposure(img, canvasNode);
var settings = exposure.settings;

settings.brightness = 1.3; // frame will automatically draw when settings has been updated. 
```

## Development 
Right now the best place to test changes would be to hack on the demo app in the `demo` folder.

```
git clone git@github.com:actionnick/exposure.git
cd exposure
npm install
grunt demo_watch
```

Then in a new tab you can start a simple HTTP server with `npm start`.

## License

MIT © [Nick Schaubeck](http://www.northofbrooklyn.nyc)
