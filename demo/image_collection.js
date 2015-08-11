var EventEmitter = require('events').EventEmitter;
var Frame = require('../src/frame');
var _ = require('lodash');
var uuid = require('uuid');

class ImageCollection extends EventEmitter {
  constructor() {
    super();
    this.frames = [];
    this.selectedFrame = null;
  }

  addNewFrame(img) {
    var callback = function(frame) {
      frame.key = uuid.v4();
      frame.thumbnail = this.createThumbnail(img, 300);
      this.frames.unshift(frame);
      this.selectFrame(frame.key);
    }.bind(this);
    
    new Frame(img, {
      callback: callback
    });
  }

  get handleImageLoad() {
    if (!this._handleImageLoad) {
      this._handleImageLoad = function(event) {
        this.emit("loading");
        var file = event.target.files[0];
        var reader = new FileReader();
        var self = this;
        reader.onload = function(e) {
          var img = new Image();
          img.onload = function() {
            self.addNewFrame(img);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }.bind(this);
    }

    return this._handleImageLoad;
  }

  get selectFrame() {
    if (!this._selectFrame) {
      this._selectFrame = function(key) {
        var frame = this.findFrame(key);
        this.selectedFrame = frame;
        this.emit("selected", frame);
      }.bind(this);
    }

    return this._selectFrame;
  }

  // Returns a square thumbnail of specified size
  createThumbnail(img, size) {
    var canvas = document.createElement("canvas");
    canvas.width = canvas.height = size
    var context = canvas.getContext("2d");
    
    var srcSize = img.height < img.width ? img.height : img.width;
    var mid = {
      x: img.width / 2,
      y: img.height / 2
    };
    var srcPos = {
      x: mid.x - (srcSize / 2),
      y: mid.y - (srcSize / 2)
    };
    context.drawImage(img, srcPos.x, srcPos.y, srcSize, srcSize, 0, 0, size, size);

    var newImg = document.createElement('img');
    newImg.src = canvas.toDataURL();
    return newImg;
  }

  findFrame(key) {
    return _.find(this.frames, "key", key);
  }
}

module.exports = ImageCollection;