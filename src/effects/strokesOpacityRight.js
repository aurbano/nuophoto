// Creates an image using only lines
var exec = function(main){
	var imgd = main.canvas.ctx.getImageData(main.img.x, main.img.y, main.img.i.width, main.img.i.height); 
	var i=0;
	for(var y = 0; y < main.img.i.height; y += main.strokeResolution){
		for(var x = 0; x < main.img.i.width; x += main.strokeResolution){
			// Draw strokes
			main.canvas.ctx.lineWidth = 1;
			main.canvas.ctx.strokeStyle = 'rgba('+main.avg[i][0]+','+main.avg[i][1]+','+main.avg[i][2]+',1)';
			main.canvas.ctx.beginPath();
			main.canvas.ctx.moveTo(x,main.img.y+y);
			main.canvas.ctx.lineTo(x+main.strokeResolution,main.img.y+y+main.strokeResolution);
			main.canvas.ctx.stroke();
			i++;
		}
	}
}