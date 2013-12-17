/**
 * Paint the canvas with vertical strokes
 * @param {Object} main
 */
var parameters = [
	{
		name : 'resolution',
		display : 'Brush size',
		type : 'number',
		value: 10
	}
];
var exec = function(main, params, callback){
	var i=0;
	for(var y = 0; y < main.canvas.HEIGHT; y += main.strokeResolution){
		for(var x = 0; x < main.canvas.WIDTH; x += main.strokeResolution){
			// Draw strokes
			main.buffer.ctx.lineWidth = 1;
			main.buffer.ctx.strokeStyle = 'rgba('+main.avg[i][0]+','+main.avg[i][1]+','+main.avg[i][2]+',1)';
			main.buffer.ctx.beginPath();
			main.buffer.ctx.moveTo(Math.floor(x+main.strokeResolution/2),main.img.y+y);
			main.buffer.ctx.lineTo(Math.floor(x+main.strokeResolution/2),main.img.y+y+main.strokeResolution);
			main.buffer.ctx.stroke();
			i++;
		}
	}
	
	callback.call();
};