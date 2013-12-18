/**
 * Canvas blur. This effect is not achieved using a normal blur solution
 * (Convoluting the pixels with a matrix) instead it redraws the image with circles
 * colored with the center pixel, that fade out. The combination of all the circles creates
 * the illusion of a blur effect.
 *  
 * @param {Object} main
 */
var parameters = [
	{
		name : 'resolution',
		display: 'Radius',
		type : 'number',
		value: 10
	}
];
var exec = function(main, params, callback){
	var imgd = main.canvas.ctx.getImageData(main.img.x, main.img.y, main.canvas.WIDTH, main.canvas.HEIGHT); 
	var pix = imgd.data, i=0, auxAvg;
	for(var y = 0; y < main.canvas.HEIGHT; y += main.strokeResolution){
		for(var x = 0; x < main.canvas.WIDTH; x += main.strokeResolution){
			// NaN protection
			if(isNaN(main.avg[i][0])) continue;
			// Draw strokes
			var rad = main.buffer.ctx.createRadialGradient(
					Math.round(x+main.strokeResolution/2),
					Math.round(main.img.y+y+main.strokeResolution/2),
					0.001,
					Math.round(x+main.strokeResolution/2),
					Math.round(main.img.y+y+main.strokeResolution/2), 
					main.strokeResolution
			);
			rad.addColorStop(0, 'rgba('+main.avg[i][0]+','+main.avg[i][1]+','+main.avg[i][2]+',1)');
			rad.addColorStop(1, 'rgba('+main.avg[i][0]+','+main.avg[i][1]+','+main.avg[i][2]+',0)');
			main.circle(
				Math.round(x+main.strokeResolution/2),
				Math.round(y+main.strokeResolution/2),
				main.strokeResolution,
				rad
			);
			i++;
		}
	}
	
	callback.call();
};