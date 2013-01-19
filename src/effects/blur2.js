var exec = function(main){
	if(main.img.i.src.length < 1) return true;
	if(!main.generated) main.generateAvg();
	var imgd = main.canvas.ctx.getImageData(main.img.x, main.img.y, main.img.i.width, main.img.i.height); 
	var pix = imgd.data, i=0, auxAvg;
	for(var y = 0; y < main.img.i.height; y += main.strokeResolution){
		for(var x = 0; x < main.img.i.width; x += main.strokeResolution){
			// Draw strokes
			var rad = main.canvas.ctx.createRadialGradient(Math.round(main.canvas.WIDTH/2+x+main.strokeResolution/2),Math.round(main.img.y+y+main.strokeResolution/2),0.01,Math.round(main.canvas.WIDTH/2+x+main.strokeResolution/2),Math.round(main.img.y+y+main.strokeResolution/2), main.strokeResolution+20);
			rad.addColorStop(0, 'rgba('+main.avg[i][0]+','+main.avg[i][1]+','+main.avg[i][2]+',1)');
			rad.addColorStop(1, 'rgba('+main.avg[i][0]+','+main.avg[i][1]+','+main.avg[i][2]+',0)');
			main.canvas.ctx.fillStyle = rad;
			main.canvas.ctx.fillRect(Math.round(main.canvas.WIDTH/2+x+main.innerMargin),Math.round(main.img.y+y),main.strokeResolution,main.strokeResolution);
			i++;
		}
	}
}