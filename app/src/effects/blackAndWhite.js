/**
 * Black And White effect
 * Real B&W, not grayScale
 * This effect takes each pixel and finds the average value of RGB.
 * It then rounds it to either black or white.
 */
var parameters = [];
var exec = function(main, params, callback) {
  // Start processing
  var imgd = main.canvas.ctx.getImageData(main.img.x, main.img.y, main.canvas.WIDTH, main.canvas.HEIGHT);
  var pix = imgd.data,
    avg, mediumColor = 0,
    points = 0;
  // Get the global average
  for (var i = 0; n = pix.length, i < n; i += 4) {
    mediumColor += (pix[i] + pix[i + 1] + pix[i + 2]) / 3;
    points++;
  }
  mediumColor = mediumColor / points;
  for (var i = 0; n = pix.length, i < n; i += 4) {
    // Get avg
    avg = (pix[i] + pix[i + 1] + pix[i + 2]) / 3;
    if (avg > mediumColor) avg = 255;
    else avg = 0;
    pix[i] = avg; // red channel
    pix[i + 1] = avg; // green channel
    pix[i + 2] = avg; // blue channel
  }
  main.buffer.ctx.putImageData(imgd, main.img.x, main.img.y);
  // Reset the averages
  main.generated = false;

  callback.call();
};
