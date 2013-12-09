/**
 * Pixelating effect, this uses the color average to run faster 
 * @param {Object} main
 */
var parameters = [
	{
		name : 'Square-size',
		type : 'number',
		value: 10
	}
];
var exec = function(main, params){
	var i = 0;
	for(var y = 0; y < main.canvas.HEIGHT; y += params['Square-size']){
		for(var x = 0; x < main.canvas.WIDTH; x += params['Square-size']){
			// Draw strokes
			auxAvg = (main.avg[i][0]+main.avg[i][1]+main.avg[i][2])/3;
			main.canvas.ctx.fillStyle = 'rgba('+main.avg[i][0]+','+main.avg[i][1]+','+main.avg[i][2]+',1)';
			main.canvas.ctx.fillRect(x,Math.round(main.img.y+y), params['Square-size'], params['Square-size']);
			i++;
		}
	}
};