/**
 * Greyscale color effect, simply changing every pixel to the RGB average 
 * @param {Object} main
 */
var parameters = [];
var exec = function(main, params, callback) {
  // Start processing
  var imgd = main.canvas.ctx.getImageData(main.img.x, main.img.y, main.canvas.WIDTH, main.canvas.HEIGHT);
  var pix = imgd.data,
    avg;
  for (var i = 0; n = pix.length, i < n; i += 4) {
    // Get avg
    avg = (pix[i] + pix[i + 1] + pix[i + 2]) / 3;
    pix[i] = avg; // red channel
    pix[i + 1] = avg; // green channel
    pix[i + 2] = avg; // blue channel
  }
  main.buffer.ctx.putImageData(imgd, main.img.x, main.img.y);
  // Reset the averages
  main.generated = false;

  callback.call();
};
