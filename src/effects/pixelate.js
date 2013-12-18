/**
 * Pixelating effect, this uses the color average to run faster 
 * @param {Object} main
 */
var parameters = [
	{
		name : 'resolution',
		display : 'Pixel size',
		type : 'number',
		value: 10
	}
];
var exec = function(main, params, callback){
	var i = 0;
	for(var y = 0; y < main.canvas.HEIGHT; y += params['resolution']){
		for(var x = 0; x < main.canvas.WIDTH; x += params['resolution']){
			// Draw strokes
			auxAvg = (main.avg[i][0]+main.avg[i][1]+main.avg[i][2])/3;
			main.buffer.ctx.fillStyle = 'rgba('+main.avg[i][0]+','+main.avg[i][1]+','+main.avg[i][2]+',1)';
			main.buffer.ctx.fillRect(x,Math.round(main.img.y+y), params['resolution'], params['resolution']);
			i++;
		}
	}
	
	callback.call();
};