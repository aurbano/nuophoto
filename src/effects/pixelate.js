// Simulates watercolor painting (I hope)
this.pixelate = function(){
	if(this.img.i.src.length < 1) return true;
	if(!this.generated) this.generateAvg();
	var imgd = this.canvas.ctx.getImageData(this.img.x, this.img.y, this.img.i.width, this.img.i.height); 
	var pix = imgd.data, i=0, auxAvg;
	for(var y = 0; y < this.img.i.height; y += this.strokeResolution){
		for(var x = 0; x < this.img.i.width; x += this.strokeResolution){
			// Draw strokes
			auxAvg = (this.avg[i][0]+this.avg[i][1]+this.avg[i][2])/3;
			this.canvas.ctx.fillStyle = 'rgba('+this.avg[i][0]+','+this.avg[i][1]+','+this.avg[i][2]+',1)';
			this.canvas.ctx.fillRect(Math.round(this.canvas.WIDTH/2+x+this.innerMargin),Math.round(this.img.y+y),this.strokeResolution, this.strokeResolution);
			i++;
		}
	}
}