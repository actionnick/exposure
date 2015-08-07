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

  // TODO: implement this plz
  createThumbnail(img) {
    return img;
  }

  findFrame(key) {
    return _.find(this.frames, "key", key);
  }
}

module.exports = ImageCollection;