"use strict";

var pica = require('pica');

var createCanvas = function createCanvas(width, height) {
  var canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

/**
 * Takes an img and resizes it so that it's largest size is equal to max size.
 * Calls callback with the new img object.
 */
var resizeImage = function resizeImage(img, maxSize, callback) {
  var width = img.width;
  var height = img.height;
  if (width <= maxSize && height <= maxSize) {
    callback(img);
    return;
  }
  var srcCanvas = createCanvas(width, height);
  var destCanvas, newHeight, newWidth;

  if (width > height) {
    newWidth = maxSize;
    newHeight = height / width * maxSize;
  } else {
    newWidth = width / height * maxSize;
    newHeight = maxSize;
  }

  var ctx = srcCanvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  destCanvas = createCanvas(newWidth, newHeight);
  pica.resizeCanvas(srcCanvas, destCanvas, function (err) {
    if (err) {
      throw err;
    }
    var imgBlob = destCanvas.toDataURL('image/png');
    var newImg = document.createElement("img");
    newImg.onload = function () {
      callback(newImg);
    };
    newImg.src = imgBlob;
  });
};

module.exports = resizeImage;
