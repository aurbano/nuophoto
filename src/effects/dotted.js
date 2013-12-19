/**
 * Recreate the image using only dots
 * @param {Object} imgEditor reference
 */
var parameters = [
	{
		name : 'resolution',
		display : 'Radius',
		type : 'number',
		value: 10
	}
];
var exec = function(main, params, callback){
	var i=0, auxAvg;
	for(var y = 0; y < main.canvas.HEIGHT; y += main.strokeResolution){
		for(var x = 0; x < main.canvas.WIDTH; x += main.strokeResolution){
			// Draw strokes
			auxAvg = (main.avg[i][0]+main.avg[i][1]+main.avg[i][2])/3;
			var rad = main.strokeResolution - main.strokeResolution*0.5,
				color = 'rgba('+main.avg[i][0]+','+main.avg[i][1]+','+main.avg[i][2]+',1)';
			main.circle(x+rad/2,y+rad/2,rad,color);
			i++;
		}
	}
	
	callback.call();
};