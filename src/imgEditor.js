/*	- imgEditor -
 *	A JavaScript/HTML5 canvas photo editor.
 *	All effects are in effects/ folder. 
 *	
 *	If no canvas ID is set, it will apply to all canvas elements found.
 *	Requires:
 *		- requireJS
 *		- jQuery
 */
var imgEditor = function(canvasID){
	// Config variables
	this.strokeResolution = 5;	// Pixel side of squares for resolution
	this.minRadius = 5;			// Minimum radius
	this.randRadius = 5;		// Max random radius extra
	this.randPosition = 2;		// Max point position deviation
	this.innerMargin = 20;		// Margin to each side of the canvas
	//
	if(canvasID == null) canvasID = 'canvas';
	if($(canvasID).length == 0){
		alert('File undefined');
		return false;
	}
	// Canvas
	this.canvas = {
		elem : $(canvasID),
		ctx : $(canvasID)[0].getContext("2d"),
		WIDTH : $(canvasID).width(),
		HEIGHT : $(canvasID).height(),
		canvasMinX : $(canvasID).offset().left,
		canvasMaxX : this.canvasMinX + this.WIDTH,
		canvasMinY : $(canvasID).offset().top,
		canvasMaxY : this.canvasMinY + this.HEIGHT
	}
	
	this.mouse = {
		x : this.canvas.WIDTH/2,
		y : this.canvas.HEIGHT/2
	}
	
	this.clear = function() {
		this.canvas.ctx.clearRect(0, 0, this.canvas.WIDTH, this.canvas.HEIGHT);
	}
	
	this.img = {
		i : new Image(),
		x : 0,
		y : 0
	}
	
	this.load = function(src, callback){
		this.img.i.src = src;
		this.img.i.onload = $.proxy( function(){
			// Resize canvas to match image size (If bigger)
			var newH = this.canvas.WIDTH, newW = this.canvas.HEIGHT;
			if(this.img.i.width > this.canvas.WIDTH) newW = this.img.i.width;
			if(this.img.i.height > this.canvas.HEIGHT) newH = this.img.i.height;
			// Store current drawn canvas
			//var cache = new Image;
			//cache.src = this.save();
			this.resizeCanvas(newH,newW);
			// Redraw the saved data
			//this.drawImage(cache);
			this.drawImage(this.img.i);
			callback.call();
		},this)
	}
	
	this.drawImage = function(img){
		this.canvas.ctx.drawImage(img, 0, 0);
	}
	
	this.background = function(color){
		// Now add the white canvas to its right
		this.canvas.ctx.fillStyle=color;
		this.canvas.ctx.fillRect(0, 0, this.canvas.WIDTH, this.canvas.HEIGHT);
	}
	
	this.resizeCanvas = function(h,w) {
		this.canvas.WIDTH = w;
		this.canvas.HEIGHT = h;
		
		this.canvas.elem.attr('width',this.canvas.WIDTH);
		this.canvas.elem.attr('height',this.canvas.HEIGHT);
	}
	
	this.circle = function(x,y,rad,color){
		// Circulo
		this.canvas.ctx.fillStyle = color;
		this.canvas.ctx.beginPath();
		this.canvas.ctx.arc(x,y,rad,0,Math.PI*2,true);
		this.canvas.ctx.closePath();
		this.canvas.ctx.fill();
	}
		
	this.newColor = function(){
		if(!this.colorful) return '#fff';
		return '#'+Math.round(0xffffff * Math.random()).toString(16);
	}
	
	this.mouseMove = function(e) {
		this.mouse.s.x = Math.max( Math.min( e.pageX - this.mouse.p.x, 40 ), -40 );
		this.mouse.s.y = Math.max( Math.min( e.pageY - this.mouse.p.y, 40 ), -40 );
		
		this.mouse.p.x = e.pageX - this.canvas.canvasMinX;
		this.mouse.p.y = e.pageY - this.canvas.canvasMinY;
	}
	
	// --------- IMAGE FUNCTIONS ----------- //
	
	// Average values
	this.avg = [];
	this.generated = false; // Flag to know if averages have been calculated.
	
	this.generateAvg = function(callback){
		this.avg = []; // clear current avg
		
		// Get samples from the image with the resolution set in strokeResolution
		var pix = this.canvas.ctx.getImageData(0, 0, this.canvas.WIDTH, this.canvas.HEIGHT), auxAvg, points;
		//
		for(var y = 0; y < pix.height; y += this.strokeResolution){
			for(var x = 0; x < pix.width; x += this.strokeResolution){
				auxAvg = [0, 0, 0];	// Avg
				points = 0;	// Pixels measured for avg (strokeResolution^2)
				for(var x1 = 0; x1 < this.strokeResolution;	x1++){
					if(x+x1 > pix.width) break;
					for(var y1 = 0; y1 < this.strokeResolution;	y1++){
						if(y+y1 > pix.height) break;
						// I now have all needed pointers
						// Get the index inside pix array
						var pixIndex = ((y+y1)*pix.width+x+x1)*4;
						auxAvg[0] += pix.data[pixIndex];
						auxAvg[1] += pix.data[pixIndex+1];
						auxAvg[2] += pix.data[pixIndex+2];
						points++;
						//console.log(pix.data[pixIndex]);
						//debugger;
					}
				}
				// Now get final average
				auxAvg[0] = Math.round(auxAvg[0]/points);
				auxAvg[1] = Math.round(auxAvg[1]/points);
				auxAvg[2] = Math.round(auxAvg[2]/points);
				// Store
				this.avg.push(auxAvg);
			}
		}
		console.log('Sampling done');
		console.log(this.avg);
		// Set flag
		this.generated = true;
		callback.call();
	}
	
	this.applyEffect = function(effect, callback){
		require(["effects/"+effect], $.proxy( function(){
			var obj = this;
			if(!this.generated){
				this.generateAvg(function(){
					exec(obj);
					callback.call();
				});
			}else{
				exec(obj);
				callback.call();
			}
		},this));
	}
	
	this.save = function(){
		return this.canvas.elem.get(0).toDataURL();
	}
	
	this.zoom = function(clicks, x, y){
		//var pt = this.canvas.elem.get(0).transformedPoint(x,y);
		this.canvas.ctx.translate(x,y);
		// Change the factor here for faster/slower zoom
		var factor = Math.pow(1.1,clicks);
		this.canvas.ctx.scale(factor,factor);
		this.canvas.ctx.translate(-x,-y);
	}

		
};