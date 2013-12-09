/**
 * Paint the canvas with vertical strokes
 * @param {Object} main
 */
var parameters = [];
var exec = function(main){
	var i=0;
	for(var y = 0; y < main.canvas.HEIGHT; y += main.strokeResolution){
		for(var x = 0; x < main.canvas.WIDTH; x += main.strokeResolution){
			// Draw strokes
			main.canvas.ctx.lineWidth = 1;
			main.canvas.ctx.strokeStyle = 'rgba('+main.avg[i][0]+','+main.avg[i][1]+','+main.avg[i][2]+',1)';
			main.canvas.ctx.beginPath();
			main.canvas.ctx.moveTo(Math.floor(x+main.strokeResolution/2),main.img.y+y);
			main.canvas.ctx.lineTo(Math.floor(x+main.strokeResolution/2),main.img.y+y+main.strokeResolution);
			main.canvas.ctx.stroke();
			i++;
		}
	}
};