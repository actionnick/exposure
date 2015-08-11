[Demo](http://actionnick.github.io/exposure/)

## Overview

Exposure allows fast image processing in the browser backed by webGL. Right now even with just brightness, contrast, and levels implemented a range of effects can be achieved. Everything from HDR to instagram like filters.

You supply the `img` to be filtered, output will be to canvas.

## Install

```sh
$ npm install --save exposure
```

## Usage

```js
var Exposure = require('exposure');

var exposure = new Exposure(img, {
  json: json,     // settings json can be created on the demo page
  canvas: canvas, // if a canvas is on the page output can be drawn there
  callback: function(exposure) {
    exposure.settings; // can be manipulated to dynamically update image
    exposure.canvas; // reference to the canvas that has the output on it
  }
});

```

## Image size

The max image size dimension currently supported by exposure is 2500. If a side is over this length the img passed in will be downscaled. 

## Settings JSON

The filter exposure renders is controlled by a json containing all the information in it. You can generate a json by visiting this link. You can also initialize frame without a json and then manipulate it live yourself.

```js
var exposure = new Exposure(img);
var settings = exposure.settings;

settings.brightness = 1.3; // frame will automatically draw when settings has been updated. 
JSON.stringify(settings.json);
```

## Development 
A good place to make or test changes would be the [demo app](http://actionnick.github.io/exposure/).

```
git clone git@github.com:actionnick/exposure.git
cd exposure
npm install
grunt demo_watch
```
in a different tab...
```
npm start
```
Then localhost:8000 should be running the demo page and the grunt command will be rebuilding whenever a shader or js file is changed.

Adding a new effect should be relatively simple. First add the properties that will control the effect to `ExposureSettings.PROPS` in `src/exposure_settings`. These names correspond to the uniforms that get passed into the main fragment shader that renders the filter, `src/shaders/exposure.frag`.

After the props have been added to `ExposureSettings.PROPS` add the necessary code to `exposure.frag` to actually implement your shader.

To test it you can actually just do something like `frame.settings.new_prop = 3` or you can add some controls for it in the demo. 

## License

MIT © [Nick Schaubeck](http://www.actionnick.nyc)

Thank you Shauna Leytus for the logo!
