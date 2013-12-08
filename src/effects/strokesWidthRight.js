/**
 * Paint the canvas with thick descending strokes that kind of simulate a brush
 * @param {Object} main
 */
var exec = function(main){
	var i=0, auxAvg;
	for(var y = 0; y < main.canvas.HEIGHT; y += main.strokeResolution){
		for(var x = 0; x < main.canvas.WIDTH; x += main.strokeResolution){
			// Draw strokes
			auxAvg = (main.avg[i][0]+main.avg[i][1]+main.avg[i][2])/3;
			main.canvas.ctx.lineWidth = (255-auxAvg)/main.strokeResolution;
			main.canvas.ctx.strokeStyle = 'rgba('+main.avg[i][0]+','+main.avg[i][1]+','+main.avg[i][2]+',1)';
			main.canvas.ctx.beginPath();
			main.canvas.ctx.moveTo(x,main.img.y+y);
			main.canvas.ctx.lineTo(x+main.strokeResolution,main.img.y+y+main.strokeResolution);
			main.canvas.ctx.stroke();
			i++;
		}
	}
};