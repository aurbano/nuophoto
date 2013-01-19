var exec = function(main){
	if(main.img.i.src.length < 1) return true;
	if(!main.generated) main.generateAvg();
	var imgd = main.canvas.ctx.getImageData(main.img.x, main.img.y, main.img.i.width, main.img.i.height); 
	var pix = imgd.data, i=0;
	for(var y = 0; y < main.img.i.height; y += main.strokeResolution){
		for(var x = 0; x < main.img.i.width; x += main.strokeResolution){
			// Draw strokes
			main.canvas.ctx.lineWidth = 1;
			main.canvas.ctx.strokeStyle = 'rgba('+main.avg[i][0]+','+main.avg[i][1]+','+main.avg[i][2]+',1)';
			main.canvas.ctx.beginPath();
			main.canvas.ctx.moveTo(main.canvas.WIDTH/2+x+main.innerMargin,Math.floor(main.img.y+y+main.strokeResolution/2));
			main.canvas.ctx.lineTo(main.canvas.WIDTH/2+x+main.innerMargin+main.strokeResolution,Math.floor(main.img.y+y+main.strokeResolution/2));
			main.canvas.ctx.stroke();
			i++;
		}
	}
}