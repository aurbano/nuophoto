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
	
	this.clear = function() {
		this.canvas.ctx.clearRect(0, 0, this.canvas.WIDTH, this.canvas.HEIGHT);
	}
	
	this.img = {
		i : new Image(),
		x : null,
		y : null
	}
	
	this.load = function(src, callback){
		this.img.i.src = src;
		this.img.i.onload = $.proxy( function(){ this.drawImage(); callback.call(); },this)
	}
	
	this.drawImage = function(){
		this.clear();
		this.img.x = parseInt(this.canvas.WIDTH/2 - this.img.i.width - this.innerMargin);
		this.img.y = parseInt(this.canvas.HEIGHT/2 - this.img.i.height/2);
		
		if(this.img.x < 0) this.img.x = 0;
		if(this.img.y < 0) this.img.y = 0;
		
		this.canvas.ctx.drawImage(this.img.i, this.img.x, this.img.y);
		
		// Now add the white canvas to its right
		this.background("#efefef");
		
		// Divider lines

		this.canvas.ctx.lineWidth = 1;
		this.canvas.ctx.strokeStyle = '#555';
		this.canvas.ctx.beginPath();
		this.canvas.ctx.moveTo(0,this.img.y);
		this.canvas.ctx.lineTo(this.canvas.WIDTH,this.img.y);
		this.canvas.ctx.moveTo(0,this.img.y + this.img.i.height);
		this.canvas.ctx.lineTo(this.canvas.WIDTH,this.img.y + this.img.i.height);
		this.canvas.ctx.moveTo(this.img.x,0);
		this.canvas.ctx.lineTo(this.img.x,this.canvas.HEIGHT);
		this.canvas.ctx.moveTo(this.img.x + this.img.i.width,0);
		this.canvas.ctx.lineTo(this.img.x + this.img.i.width,this.canvas.HEIGHT);
		this.canvas.ctx.moveTo(this.canvas.WIDTH/2 + this.innerMargin,0);
		this.canvas.ctx.lineTo(this.canvas.WIDTH/2 + this.innerMargin,this.canvas.HEIGHT);
		this.canvas.ctx.moveTo(this.canvas.WIDTH/2 + this.img.i.width + this.innerMargin,0);
		this.canvas.ctx.lineTo(this.canvas.WIDTH/2 + this.img.i.width + this.innerMargin,this.canvas.HEIGHT);
		this.canvas.ctx.stroke();
	}
	
	this.background = function(color){
		// Now add the white canvas to its right
		this.canvas.ctx.fillStyle=color;
		this.canvas.ctx.fillRect(this.canvas.WIDTH/2 + this.innerMargin, this.img.y, this.img.i.width, this.img.i.height);
	}
	
	this.mouse = {
		s : {x:0, y:0},	// Mouse speed
		p : {x:0, y:0}	// Mouse position
	}
	
	this.resizeCanvas = function(canvasID) {
		this.canvas.WIDTH = window.innerWidth;
		this.canvas.HEIGHT = window.innerHeight;
		
		this.canvas.elem.attr('width',this.canvas.WIDTH);
		this.canvas.elem.attr('height',this.canvas.HEIGHT);
		
		// Overlay
		$('#overlay').css({width : this.canvas.WIDTH, height : this.canvas.HEIGHT});
		
		// Redraw
		this.drawImage();
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
	
	this.generateAvg = function(){
		this.avg = []; // clear current avg
		
		// Fills an array with the rgb values in average for each square in the pic
		if(this.img.i.src.length < 1) return true; // Check if image exists
		var imgd = this.canvas.ctx.getImageData(this.img.x, this.img.y, this.img.i.width, this.img.i.height); 
		var pix = imgd.data, avg1, auxAvg, points;
		for(var y = 0; y < this.img.i.height; y += this.strokeResolution){
			for(var x = 0; x < this.img.i.width; x += this.strokeResolution){
				auxAvg = [0, 0, 0];	// Avg
				points = 0;	// Pixels measured for avg
				for(var x1 = 0; x1 < this.strokeResolution;	x1++){
					if(x+x1 > this.img.i.width) break;
					for(var y1 = 0; y1 < this.strokeResolution;	y1++){
						if(y+y1 > this.img.i.height) break;
						// I now have all needed pointers
						// Get the index inside pix array
						var pixIndex = ((y+y1)*this.img.i.width+x+x1)*4;
						auxAvg[0] += pix[pixIndex];
						auxAvg[1] += pix[pixIndex+1];
						auxAvg[2] += pix[pixIndex+2];
						points++;
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
		// Set flag
		this.generated = true;
	}
	
	this.applyEffect = function(effect){
		require(["effects/"+effect], $.proxy( function(){
			exec(this);
		},this));
	}
	
	this.resizeCanvas();
};