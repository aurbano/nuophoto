var exec = function(main){
	if(main.img.i.src.length < 1) return true;
	// Start processing
	var imgd = main.canvas.ctx.getImageData(main.img.x, main.img.y, main.img.i.width, main.img.i.height); 
	var pix = imgd.data, avg;
	for (var i = 0; n = pix.length, i < n; i += 4) {
		// Get avg
		avg = (pix[i]+pix[i+1]+pix[i+2])/3;
		pix[i] = avg; // red channel
		pix[i+1] = avg; // green channel
		pix[i+2] = avg; // blue channel
	}
	main.canvas.ctx.putImageData(imgd, main.img.x, main.img.y);
	// Reset the averages
	main.generated = false;
}