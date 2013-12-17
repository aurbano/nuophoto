/**
 * Paint the canvas with horizontal strokes 
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
			main.canvas.ctx.lineWidth = 1;
			main.canvas.ctx.strokeStyle = 'rgba('+main.avg[i][0]+','+main.avg[i][1]+','+main.avg[i][2]+',1)';
			main.canvas.ctx.beginPath();
			main.canvas.ctx.moveTo(x,Math.floor(main.img.y+y+main.strokeResolution/2));
			main.canvas.ctx.lineTo(x+main.strokeResolution,Math.floor(main.img.y+y+main.strokeResolution/2));
			main.canvas.ctx.stroke();
			i++;
		}
	}
	
	callback.call();
};