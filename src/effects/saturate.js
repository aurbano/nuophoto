// Saturate colors
var exec = function(main){
	// Start processing
	var imgd = main.canvas.ctx.getImageData(main.img.x, main.img.y, main.img.i.width, main.img.i.height); 
	var pix = imgd.data, avg;
	for (var i = 0; n = pix.length, i < n; i += 4) {
		// Get avg
		var maxRGB = i;
		if(pix[i+1]>pix[i]) maxRGB = i+1;
		if(pix[i+2]>pix[maxRGB]) maxRGB = i+2;
		pix[maxRGB] = Math.min(pix[maxRGB]+0.1*pix[maxRGB],255);
	}
	main.canvas.ctx.putImageData(imgd, main.img.x, main.img.y);
	// Reset the averages
	main.generated = false;
}