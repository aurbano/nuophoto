// main one will simulate an rgb pixel screen with small resolution
var exec = function(main){
	var i=0;
	for(var y = 0; y < main.img.i.height; y += main.strokeResolution){
		for(var x = 0; x < main.img.i.width; x += main.strokeResolution){
			// Draw strokes
			main.canvas.ctx.fillStyle = 'rgba('+main.avg[i][0]+',0,0,1)';
			main.canvas.ctx.fillRect(Math.ceil(x),Math.round(main.img.y+y),Math.ceil(main.strokeResolution/3), main.strokeResolution);
			
			main.canvas.ctx.fillStyle = 'rgba(0,'+main.avg[i][1]+',0,1)';
			main.canvas.ctx.fillRect(Math.ceil(x+main.strokeResolution/3),Math.round(main.img.y+y),Math.ceil(main.strokeResolution/3), main.strokeResolution);
			
			main.canvas.ctx.fillStyle = 'rgba(0,0,'+main.avg[i][2]+',1)';
			main.canvas.ctx.fillRect(Math.ceil(x+2*main.strokeResolution/3),Math.round(main.img.y+y),Math.ceil(main.strokeResolution/3), main.strokeResolution);
			i++;
		}
	}
}