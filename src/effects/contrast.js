/**
 * Add more contrast to the image, multiplying the RGB coordinates.
 * @param {Object} main
 */
var parameters = [];
var exec = function(main, params, callback){
	// Start processing
	var imgd = main.canvas.ctx.getImageData(main.img.x, main.img.y, main.canvas.WIDTH, main.canvas.HEIGHT); 
	var pix = imgd.data, avg;
	for (var i = 0; n = pix.length, i < n; i += 4) {
		// Get avg
		pix[i] = Math.min((.393 * pix[i]) + (.769 * pix[i+1]) + (.189 * (pix[i+2])), 255); // red channel
		pix[i+1] = Math.min((.349 * pix[i]) + (.686 * pix[i+1]) + (.168 * (pix[i+2])), 255); // red channel
		pix[i+2] = Math.min((.272 * pix[i]) + (.534 * pix[i+1]) + (.131 * (pix[i+2])), 255); // red channel
	}
	main.buffer.ctx.putImageData(imgd, main.img.x, main.img.y);
	// Reset the averages
	main.generated = false;
	
	callback.call();
};