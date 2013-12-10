/**
 * Draw empty squares stroked with the average color of the pixels below it
 * @param {Object} main
 */
var parameters = [
	{
		name : 'resolution',
		display : 'Square size',
		type : 'number',
		value: 10
	}
];
var exec = function(main){
	var i=0;
	for(var y = 0; y < main.canvas.HEIGHT; y += main.strokeResolution){
		for(var x = 0; x < main.canvas.WIDTH; x += main.strokeResolution){
			// Draw strokes
			auxAvg = (main.avg[i][0]+main.avg[i][1]+main.avg[i][2])/3;
			main.canvas.ctx.strokeStyle = 'rgba('+main.avg[i][0]+','+main.avg[i][1]+','+main.avg[i][2]+',1)';
			main.canvas.ctx.strokeRect(x,Math.round(main.img.y+y),main.strokeResolution*(255-auxAvg)/255, main.strokeResolution*(255-auxAvg)/255);
			if(main.strokeResolution*(255-auxAvg)/255 > main.strokeResolution*0.8)
				main.canvas.ctx.strokeRect(Math.round(x+main.strokeResolution/3),Math.round(main.img.y+y+main.strokeResolution/3),main.strokeResolution/3, main.strokeResolution/3);
			i++;
		}
	}
};