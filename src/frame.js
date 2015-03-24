class Frame {
  constructor(image, options) {
    this.image = image;
    this.canvas = options.canvas || this.createCanvas();
    this.gl = this.initGlContext(this.canvas);
  }

  sharpen() {

    return this;
  }


}