function createThumbnail(img, size) {
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

module.exports = createThumbnail;
