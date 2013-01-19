// Simulates watercolor painting (I hope)
var exec = function(main){
	if(main.img.i.src.length < 1) return true;
	if(!main.generated) main.generateAvg();
	var imgd = main.canvas.ctx.getImageData(main.img.x, main.img.y, main.img.i.width, main.img.i.height); 
	var pix = imgd.data, i=0, auxAvg;
	for(var y = 0; y < main.img.i.height; y += main.strokeResolution){
		for(var x = 0; x < main.img.i.width; x += main.strokeResolution){
			// Draw strokes
			auxAvg = (main.avg[i][0]+main.avg[i][1]+main.avg[i][2])/3;
			main.circle(Math.round(main.canvas.WIDTH/2+x+main.innerMargin+main.strokeResolution/2)+main.randPosition*Math.cos(Math.random()),Math.round(main.img.y+y+main.strokeResolution/2)+main.randPosition*Math.sin(Math.random()),(255-auxAvg)*(main.strokeResolution-main.minRadius)/255+main.minRadius+main.randRadius*Math.random(),'rgba('+main.avg[i][0]+','+main.avg[i][1]+','+main.avg[i][2]+',0.5)');
			i++;
		}
	}
}
