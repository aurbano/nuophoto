/**
 *  Emboss effect (Using matrix convolution)
 * @param {Object} main
 */
var parameters = [];
var exec = function(main, params, callback) {
  var imgd = main.canvas.ctx.getImageData(0, 0, main.canvas.WIDTH, main.canvas.HEIGHT);
  var pix = imgd.data,
    total = pix.length;
  for (var i = 0; i < total; i++) {
    if (i % 4 == 3) continue;
    // Edge detection matrix
    pix[i] = 127 + 2 * pix[i] - pix[i + 4] - pix[i + main.canvas.WIDTH * 4];
  }
  main.buffer.ctx.putImageData(imgd, 0, 0);

  callback.call();
};
