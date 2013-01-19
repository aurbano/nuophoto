// main one will simulate an rgb pixel screen with small resolution
var exec = function(main){
	if(main.img.i.src.length < 1) return true;
	if(!main.generated) main.generateAvg();
	var imgd = main.canvas.ctx.getImageData(main.img.x, main.img.y, main.img.i.width, main.img.i.height); 
	var pix = imgd.data, i=0, auxAvg;
	for(var y = 0; y < main.img.i.height; y += main.strokeResolution){
		for(var x = 0; x < main.img.i.width; x += main.strokeResolution){
			// Draw strokes
			main.canvas.ctx.fillStyle = 'rgba('+main.avg[i][0]+',0,0,1)';
			main.canvas.ctx.fillRect(Math.ceil(main.canvas.WIDTH/2+x+main.innerMargin),Math.round(main.img.y+y),Math.ceil(main.strokeResolution/3), main.strokeResolution);
			
			main.canvas.ctx.fillStyle = 'rgba(0,'+main.avg[i][1]+',0,1)';
			main.canvas.ctx.fillRect(Math.ceil(main.canvas.WIDTH/2+x+main.innerMargin+main.strokeResolution/3),Math.round(main.img.y+y),Math.ceil(main.strokeResolution/3), main.strokeResolution);
			
			main.canvas.ctx.fillStyle = 'rgba(0,0,'+main.avg[i][2]+',1)';
			main.canvas.ctx.fillRect(Math.ceil(main.canvas.WIDTH/2+x+main.innerMargin+2*main.strokeResolution/3),Math.round(main.img.y+y),Math.ceil(main.strokeResolution/3), main.strokeResolution);
			i++;
		}
	}
}