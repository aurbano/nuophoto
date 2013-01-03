var ImgEditor = function(){
	// Config variables
	this.strokeResolution = 5;	// Pixel side of squares for resolution
	this.minRadius = 5;			// Minimum radius
	this.randRadius = 5;		// Max random radius extra
	this.randPosition = 2;		// Max point position deviation
	this.innerMargin = 20;		// Margin to each side of the canvas
	// Canvas
	this.canvas = {
		ctx : $('#bg')[0].getContext("2d"),
		WIDTH : $("#bg").width(),
		HEIGHT : $("#bg").height(),
		canvasMinX : $("#bg").offset().left,
		canvasMaxX : this.canvasMinX + this.WIDTH,
		canvasMinY : $("#bg").offset().top,
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
		this.canvas.ctx.fillStyle="#efefef";
		this.canvas.ctx.fillRect(this.canvas.WIDTH/2 + this.innerMargin, this.img.y, this.img.i.width, this.img.i.height);
		
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
	
	this.mouse = {
		s : {x:0, y:0},	// Mouse speed
		p : {x:0, y:0}	// Mouse position
	}
	
	this.resizeCanvas = function() {
		this.canvas.WIDTH = window.innerWidth;
		this.canvas.HEIGHT = window.innerHeight;
		
		$("#bg").attr('width',this.canvas.WIDTH);
		$("#bg").attr('height',this.canvas.HEIGHT);
		
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
	
	// Changes the current image to black and white
	this.blackAndWhite = function(){
		if(this.img.i.src.length < 1) return true;
		// Start processing
		var imgd = this.canvas.ctx.getImageData(this.img.x, this.img.y, this.img.i.width, this.img.i.height); 
		var pix = imgd.data, avg;
		for (var i = 0; n = pix.length, i < n; i += 4) {
			// Get avg
			avg = (pix[i]+pix[i+1]+pix[i+2])/3;
			pix[i] = avg; // red channel
			pix[i+1] = avg; // green channel
			pix[i+2] = avg; // blue channel
		}
		this.canvas.ctx.putImageData(imgd, this.img.x, this.img.y);
		// Reset the averages
		this.generated = false;
	}
	
	// Changes the current image to sepia
	this.sepia = function(){
		if(this.img.i.src.length < 1) return true;
		// Start processing
		var imgd = this.canvas.ctx.getImageData(this.img.x, this.img.y, this.img.i.width, this.img.i.height); 
		var pix = imgd.data, avg;
		for (var i = 0; n = pix.length, i < n; i += 4) {
			// Get avg
			avg = (pix[i]+pix[i+1]+pix[i+2])/3;
			pix[i] = Math.min(avg+50, 255); // red channel
			pix[i+1] = Math.min(avg+20, 255); // green channel
			pix[i+2] = Math.max(avg-20, 0); // blue channel
		}
		this.canvas.ctx.putImageData(imgd, this.img.x, this.img.y);
		// Reset the averages
		this.generated = false;
	}
	
	// Changes the current image to sepia
	this.contrast = function(){
		if(this.img.i.src.length < 1) return true;
		// Start processing
		var imgd = this.canvas.ctx.getImageData(this.img.x, this.img.y, this.img.i.width, this.img.i.height); 
		var pix = imgd.data, avg;
		for (var i = 0; n = pix.length, i < n; i += 4) {
			// Get avg
			pix[i] = Math.min((.393 * pix[i]) + (.769 * pix[i+1]) + (.189 * (pix[i+2])), 255); // red channel
			pix[i+1] = Math.min((.349 * pix[i]) + (.686 * pix[i+1]) + (.168 * (pix[i+2])), 255); // red channel
			pix[i+2] = Math.min((.272 * pix[i]) + (.534 * pix[i+1]) + (.131 * (pix[i+2])), 255); // red channel
		}
		this.canvas.ctx.putImageData(imgd, this.img.x, this.img.y);
		// Reset the averages
		this.generated = false;
	}
	
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
	
	// Creates an image using only lines
	this.strokesWidthLeft = function(){
		if(this.img.i.src.length < 1) return true;
		if(!this.generated) this.generateAvg();
		var imgd = this.canvas.ctx.getImageData(this.img.x, this.img.y, this.img.i.width, this.img.i.height); 
		var pix = imgd.data, i=0, auxAvg;
		for(var y = 0; y < this.img.i.height; y += this.strokeResolution){
			for(var x = 0; x < this.img.i.width; x += this.strokeResolution){
				// Draw strokes
				auxAvg = (this.avg[i][0]+this.avg[i][1]+this.avg[i][2])/3;
				this.canvas.ctx.lineWidth = (255-auxAvg)/this.strokeResolution;
				this.canvas.ctx.strokeStyle = 'rgba('+this.avg[i][0]+','+this.avg[i][1]+','+this.avg[i][2]+',1)';
				this.canvas.ctx.beginPath();
				this.canvas.ctx.moveTo(this.canvas.WIDTH/2+this.innerMargin+x+this.strokeResolution,this.img.y+y);
				this.canvas.ctx.lineTo(this.canvas.WIDTH/2+this.innerMargin+x,this.img.y+y+this.strokeResolution);
				this.canvas.ctx.stroke();
				i++;
			}
		}
	}
	
	// Creates an image using only lines
	this.strokesWidthRight = function(){
		if(this.img.i.src.length < 1) return true;
		if(!this.generated) this.generateAvg();
		var imgd = this.canvas.ctx.getImageData(this.img.x, this.img.y, this.img.i.width, this.img.i.height); 
		var pix = imgd.data, i=0, auxAvg;
		for(var y = 0; y < this.img.i.height; y += this.strokeResolution){
			for(var x = 0; x < this.img.i.width; x += this.strokeResolution){
				// Draw strokes
				auxAvg = (this.avg[i][0]+this.avg[i][1]+this.avg[i][2])/3;
				this.canvas.ctx.lineWidth = (255-auxAvg)/this.strokeResolution;
				this.canvas.ctx.strokeStyle = 'rgba('+this.avg[i][0]+','+this.avg[i][1]+','+this.avg[i][2]+',1)';
				this.canvas.ctx.beginPath();
				this.canvas.ctx.moveTo(this.canvas.WIDTH/2+x+this.innerMargin,this.img.y+y);
				this.canvas.ctx.lineTo(this.canvas.WIDTH/2+x+this.innerMargin+this.strokeResolution,this.img.y+y+this.strokeResolution);
				this.canvas.ctx.stroke();
				i++;
			}
		}
	}
	
	// Creates an image using only lines
	this.strokesPastel = function(){
		if(this.img.i.src.length < 1) return true;
		if(!this.generated) this.generateAvg();
		var imgd = this.canvas.ctx.getImageData(this.img.x, this.img.y, this.img.i.width, this.img.i.height); 
		var pix = imgd.data, i=0, auxAvg;
		for(var y = 0; y < this.img.i.height; y += this.strokeResolution){
			for(var x = 0; x < this.img.i.width; x += this.strokeResolution){
				// Draw strokes
				auxAvg = (this.avg[i][0]+this.avg[i][1]+this.avg[i][2])/3;
				this.canvas.ctx.lineWidth = (255-auxAvg)/this.strokeResolution;
				this.canvas.ctx.strokeStyle = 'rgba('+this.avg[i][0]+','+this.avg[i][1]+','+this.avg[i][2]+','+(255-auxAvg)/255+')';
				this.canvas.ctx.beginPath();
				this.canvas.ctx.moveTo(this.canvas.WIDTH/2+x+this.innerMargin+this.strokeResolution,this.img.y+y);
				this.canvas.ctx.lineTo(this.canvas.WIDTH/2+x+this.innerMargin,this.img.y+y+this.strokeResolution);
				this.canvas.ctx.stroke();
				i++;
			}
		}
	}
	
	// Creates an image using only lines
	this.strokesOpacityLeft = function(){
		if(this.img.i.src.length < 1) return true;
		if(!this.generated) this.generateAvg();
		var imgd = this.canvas.ctx.getImageData(this.img.x, this.img.y, this.img.i.width, this.img.i.height); 
		var pix = imgd.data, i=0;
		for(var y = 0; y < this.img.i.height; y += this.strokeResolution){
			for(var x = 0; x < this.img.i.width; x += this.strokeResolution){
				// Draw strokes
				this.canvas.ctx.lineWidth = 1;
				this.canvas.ctx.strokeStyle = 'rgba('+this.avg[i][0]+','+this.avg[i][1]+','+this.avg[i][2]+',1)';
				this.canvas.ctx.beginPath();
				this.canvas.ctx.moveTo(this.canvas.WIDTH/2+x+this.innerMargin+this.strokeResolution,this.img.y+y);
				this.canvas.ctx.lineTo(this.canvas.WIDTH/2+x+this.innerMargin,this.img.y+y+this.strokeResolution);
				this.canvas.ctx.stroke();
				i++;
			}
		}
	}	
	
	// Creates an image using only lines
	this.strokesOpacityRight = function(){
		if(this.img.i.src.length < 1) return true;
		if(!this.generated) this.generateAvg();
		var imgd = this.canvas.ctx.getImageData(this.img.x, this.img.y, this.img.i.width, this.img.i.height); 
		var pix = imgd.data, i=0;
		for(var y = 0; y < this.img.i.height; y += this.strokeResolution){
			for(var x = 0; x < this.img.i.width; x += this.strokeResolution){
				// Draw strokes
				this.canvas.ctx.lineWidth = 1;
				this.canvas.ctx.strokeStyle = 'rgba('+this.avg[i][0]+','+this.avg[i][1]+','+this.avg[i][2]+',1)';
				this.canvas.ctx.beginPath();
				this.canvas.ctx.moveTo(this.canvas.WIDTH/2+x+this.innerMargin,this.img.y+y);
				this.canvas.ctx.lineTo(this.canvas.WIDTH/2+x+this.innerMargin+this.strokeResolution,this.img.y+y+this.strokeResolution);
				this.canvas.ctx.stroke();
				i++;
			}
		}
	}
	
	// 
	this.strokesOpacityVertical = function(){
		if(this.img.i.src.length < 1) return true;
		if(!this.generated) this.generateAvg();
		var imgd = this.canvas.ctx.getImageData(this.img.x, this.img.y, this.img.i.width, this.img.i.height); 
		var pix = imgd.data, i=0;
		for(var y = 0; y < this.img.i.height; y += this.strokeResolution){
			for(var x = 0; x < this.img.i.width; x += this.strokeResolution){
				// Draw strokes
				this.canvas.ctx.lineWidth = 1;
				this.canvas.ctx.strokeStyle = 'rgba('+this.avg[i][0]+','+this.avg[i][1]+','+this.avg[i][2]+',1)';
				this.canvas.ctx.beginPath();
				this.canvas.ctx.moveTo(Math.floor(this.canvas.WIDTH/2+x+this.innerMargin+this.strokeResolution/2),this.img.y+y);
				this.canvas.ctx.lineTo(Math.floor(this.canvas.WIDTH/2+x+this.innerMargin+this.strokeResolution/2),this.img.y+y+this.strokeResolution);
				this.canvas.ctx.stroke();
				i++;
			}
		}
	}
	
	this.strokesOpacityHorizontal = function(){
		if(this.img.i.src.length < 1) return true;
		if(!this.generated) this.generateAvg();
		var imgd = this.canvas.ctx.getImageData(this.img.x, this.img.y, this.img.i.width, this.img.i.height); 
		var pix = imgd.data, i=0;
		for(var y = 0; y < this.img.i.height; y += this.strokeResolution){
			for(var x = 0; x < this.img.i.width; x += this.strokeResolution){
				// Draw strokes
				this.canvas.ctx.lineWidth = 1;
				this.canvas.ctx.strokeStyle = 'rgba('+this.avg[i][0]+','+this.avg[i][1]+','+this.avg[i][2]+',1)';
				this.canvas.ctx.beginPath();
				this.canvas.ctx.moveTo(this.canvas.WIDTH/2+x+this.innerMargin,Math.floor(this.img.y+y+this.strokeResolution/2));
				this.canvas.ctx.lineTo(this.canvas.WIDTH/2+x+this.innerMargin+this.strokeResolution,Math.floor(this.img.y+y+this.strokeResolution/2));
				this.canvas.ctx.stroke();
				i++;
			}
		}
	}
	
	// Simulates watercolor painting (I hope)
	this.watercolor = function(){
		if(this.img.i.src.length < 1) return true;
		if(!this.generated) this.generateAvg();
		var imgd = this.canvas.ctx.getImageData(this.img.x, this.img.y, this.img.i.width, this.img.i.height); 
		var pix = imgd.data, i=0, auxAvg;
		for(var y = 0; y < this.img.i.height; y += this.strokeResolution){
			for(var x = 0; x < this.img.i.width; x += this.strokeResolution){
				// Draw strokes
				auxAvg = (this.avg[i][0]+this.avg[i][1]+this.avg[i][2])/3;
				this.circle(Math.round(this.canvas.WIDTH/2+x+this.innerMargin+this.strokeResolution/2)+this.randPosition*Math.cos(Math.random()),Math.round(this.img.y+y+this.strokeResolution/2)+this.randPosition*Math.sin(Math.random()),(255-auxAvg)*(this.strokeResolution-this.minRadius)/255+this.minRadius+this.randRadius*Math.random(),'rgba('+this.avg[i][0]+','+this.avg[i][1]+','+this.avg[i][2]+',0.5)');
				i++;
			}
		}
	}
	
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
	
	// Simulates watercolor painting (I hope)
	this.squaresFilled = function(){
		if(this.img.i.src.length < 1) return true;
		if(!this.generated) this.generateAvg();
		var imgd = this.canvas.ctx.getImageData(this.img.x, this.img.y, this.img.i.width, this.img.i.height); 
		var pix = imgd.data, i=0, auxAvg;
		for(var y = 0; y < this.img.i.height; y += this.strokeResolution){
			for(var x = 0; x < this.img.i.width; x += this.strokeResolution){
				// Draw strokes
				auxAvg = (this.avg[i][0]+this.avg[i][1]+this.avg[i][2])/3;
				this.canvas.ctx.fillStyle = 'rgba('+this.avg[i][0]+','+this.avg[i][1]+','+this.avg[i][2]+',1)';
				this.canvas.ctx.fillRect(Math.round(this.canvas.WIDTH/2+x+this.innerMargin),Math.round(this.img.y+y),this.strokeResolution*(255-auxAvg)/255, this.strokeResolution*(255-auxAvg)/255);
				i++;
			}
		}
	}
	
	// Simulates watercolor painting (I hope)
	this.squaresLines = function(){
		if(this.img.i.src.length < 1) return true;
		if(!this.generated) this.generateAvg();
		var imgd = this.canvas.ctx.getImageData(this.img.x, this.img.y, this.img.i.width, this.img.i.height); 
		var pix = imgd.data, i=0, auxAvg;
		for(var y = 0; y < this.img.i.height; y += this.strokeResolution){
			for(var x = 0; x < this.img.i.width; x += this.strokeResolution){
				// Draw strokes
				auxAvg = (this.avg[i][0]+this.avg[i][1]+this.avg[i][2])/3;
				this.canvas.ctx.strokeStyle = 'rgba('+this.avg[i][0]+','+this.avg[i][1]+','+this.avg[i][2]+',1)';
				this.canvas.ctx.strokeRect(Math.round(this.canvas.WIDTH/2+x+this.innerMargin),Math.round(this.img.y+y),this.strokeResolution*(255-auxAvg)/255, this.strokeResolution*(255-auxAvg)/255);
				if(this.strokeResolution*(255-auxAvg)/255 > this.strokeResolution*0.8)
					this.canvas.ctx.strokeRect(Math.round(this.canvas.WIDTH/2+x+this.innerMargin+this.strokeResolution/3),Math.round(this.img.y+y+this.strokeResolution/3),this.strokeResolution/3, this.strokeResolution/3);
				i++;
			}
		}
	}
	
	// This one will simulate an rgb pixel screen with small resolution
	this.rgbPixels = function(){
		if(this.img.i.src.length < 1) return true;
		if(!this.generated) this.generateAvg();
		var imgd = this.canvas.ctx.getImageData(this.img.x, this.img.y, this.img.i.width, this.img.i.height); 
		var pix = imgd.data, i=0, auxAvg;
		for(var y = 0; y < this.img.i.height; y += this.strokeResolution){
			for(var x = 0; x < this.img.i.width; x += this.strokeResolution){
				// Draw strokes
				this.canvas.ctx.fillStyle = 'rgba('+this.avg[i][0]+',0,0,1)';
				this.canvas.ctx.fillRect(Math.ceil(this.canvas.WIDTH/2+x+this.innerMargin),Math.round(this.img.y+y),Math.ceil(this.strokeResolution/3), this.strokeResolution);
				
				this.canvas.ctx.fillStyle = 'rgba(0,'+this.avg[i][1]+',0,1)';
				this.canvas.ctx.fillRect(Math.ceil(this.canvas.WIDTH/2+x+this.innerMargin+this.strokeResolution/3),Math.round(this.img.y+y),Math.ceil(this.strokeResolution/3), this.strokeResolution);
				
				this.canvas.ctx.fillStyle = 'rgba(0,0,'+this.avg[i][2]+',1)';
				this.canvas.ctx.fillRect(Math.ceil(this.canvas.WIDTH/2+x+this.innerMargin+2*this.strokeResolution/3),Math.round(this.img.y+y),Math.ceil(this.strokeResolution/3), this.strokeResolution);
				i++;
			}
		}
	}
	
	// Simulates watercolor painting (I hope)
	this.blur = function(){
		if(this.img.i.src.length < 1) return true;
		if(!this.generated) this.generateAvg();
		var imgd = this.canvas.ctx.getImageData(this.img.x, this.img.y, this.img.i.width, this.img.i.height); 
		var pix = imgd.data, i=0, auxAvg;
		for(var y = 0; y < this.img.i.height; y += this.strokeResolution){
			for(var x = 0; x < this.img.i.width; x += this.strokeResolution){
				// Draw strokes
				this.circle(Math.round(this.canvas.WIDTH/2+x+this.innerMargin),Math.round(this.img.y+y),this.strokeResolution,'rgba('+this.avg[i][0]+','+this.avg[i][1]+','+this.avg[i][2]+',0.3)');
				this.circle(Math.round(this.canvas.WIDTH/2+x+this.innerMargin),Math.round(this.img.y+y+this.strokeResolution),this.strokeResolution,'rgba('+this.avg[i][0]+','+this.avg[i][1]+','+this.avg[i][2]+',0.3)');
				this.circle(Math.round(this.canvas.WIDTH/2+x+this.innerMargin+this.strokeResolution),Math.round(this.img.y+y),this.strokeResolution,'rgba('+this.avg[i][0]+','+this.avg[i][1]+','+this.avg[i][2]+',0.3)');
				this.circle(Math.round(this.canvas.WIDTH/2+x+this.innerMargin+this.strokeResolution),Math.round(this.img.y+y+this.strokeResolution),this.strokeResolution,'rgba('+this.avg[i][0]+','+this.avg[i][1]+','+this.avg[i][2]+',0.3)');
				i++;
			}
		}
	}
	
	this.blur2 = function(){
		if(this.img.i.src.length < 1) return true;
		if(!this.generated) this.generateAvg();
		var imgd = this.canvas.ctx.getImageData(this.img.x, this.img.y, this.img.i.width, this.img.i.height); 
		var pix = imgd.data, i=0, auxAvg;
		for(var y = 0; y < this.img.i.height; y += this.strokeResolution){
			for(var x = 0; x < this.img.i.width; x += this.strokeResolution){
				// Draw strokes
				var rad = this.canvas.ctx.createRadialGradient(Math.round(this.canvas.WIDTH/2+x+this.strokeResolution/2),Math.round(this.img.y+y+this.strokeResolution/2),0.01,Math.round(this.canvas.WIDTH/2+x+this.strokeResolution/2),Math.round(this.img.y+y+this.strokeResolution/2), this.strokeResolution+20);
				rad.addColorStop(0, 'rgba('+this.avg[i][0]+','+this.avg[i][1]+','+this.avg[i][2]+',1)');
				rad.addColorStop(1, 'rgba('+this.avg[i][0]+','+this.avg[i][1]+','+this.avg[i][2]+',0)');
				this.canvas.ctx.fillStyle = rad;
    			this.canvas.ctx.fillRect(Math.round(this.canvas.WIDTH/2+x+this.innerMargin),Math.round(this.img.y+y),this.strokeResolution,this.strokeResolution);
				i++;
			}
		}
	}
	
	this.strokesOpacityAll = function(){
		this.strokesOpacityLeft();
		this.strokesOpacityRight();
		this.strokesOpacityVertical();
		this.strokesOpacityHorizontal();
	}
	
	this.resizeCanvas();
};
// Menu functions and info
var layers = new Array();
var history = new Array();

function addLayer(name, color){
	layers.push(name);
	var span = '', eye='';
	if(layers.length > 1){
		eye = '<i class="icon-eye-open icon-large"></i> ';
		span = '<span><i class="icon-trash"></span>';
	}
	$('<li><a href="#layers" rel="'+(layers.length-1)+'" style="border-left:'+color+' solid 3px">'+eye+name+span+'</a></li>').prependTo('#layers');
	$('#layers a span').unbind('click');
	$('#layers a span').click(function(e){
		e.preventDefault();
		e.stopPropagation();
		var index = $(this).parent().attr('rel');
		removeLayer(index);
	});
}

function addHistory(name, color){
	history.push(name);
	$('<li><a href="#layers" rel="'+(history.length-1)+'" style="border-left:'+color+' solid 3px" title="Go back">'+name+'</a></li>').prependTo('#history');
	$('#history a').click(function(e){
		e.preventDefault();
		e.stopPropagation();
		console.log('Going back in time');
	});
}

function removeLayer(index){
	layers.splice(index,1);
	$("#layers a[rel='"+index+"']").parent('li').remove();
}

function displayGallery(){
	$('#overlay').fadeIn(300, function(){
		$('#gallery').show();
	});
}

function displayWebPhoto(){
	$('#overlay').fadeIn(300, function(){
		$('#webPhoto').show();
	});
}

$(document).ready(function(e){
	var editor = new ImgEditor();
	editor.load('img/editor/1.jpg', function(){
		addHistory('New photo','#C30'); // Initial background layer
		addLayer('<i class="picker" style="background:#efefef"></i> Background','#3FC230'); // Initial background layer
	});
	
	$('.gui a').click(function(e){
		e.preventDefault();
		// Intercept gallery calls
		if($(this).attr('href') == '#gallery') return displayGallery();
		if($(this).attr('href') == '#webPhoto') return displayWebPhoto();
		if($(this).attr('href') == '#download') return alert('Not ready yet!');
		// Copy color from tool
		var color = $(this).css('borderLeftColor');
		// Normal effect
		addHistory($(this).text(),color);
		addLayer($(this).text(),color);
		editor[$(this).attr('href').substring(1)]();
	});
	
	$('.gui h3').click(function(e){
		e.preventDefault();
		if($(this).children('i').first().attr('class') == 'icon-caret-right'){
			// Collapsed
			$(this).next('ul').slideDown(100);
			$(this).children('i').first().removeClass('icon-caret-right').addClass('icon-caret-down');
			return true;	
		}
		$(this).next('ul').slideUp(100);
		$(this).children('i').first().removeClass('icon-caret-down').addClass('icon-caret-right');
	});
	
	$('canvas, #config').click(function(e){
		e.preventDefault();
		$('#navBar ul').slideUp(100);
		$('#navBar h3 i').removeClass('icon-caret-down').addClass('icon-caret-right');
	});
	
	$('#overlay').click(function(e){
		e.preventDefault();
		$('#gallery').fadeOut(300);
		$('#webPhoto').fadeOut(300);
		$('#overlay').fadeOut(300);
	});
	
	$('#photoList a').click(function(e){
		e.preventDefault();
		// Now load the new pic
		editor.load('img/editor/'+$(this).attr('rel'));
		$('#gallery').fadeOut(300);
		$('#webPhoto').fadeOut(300);
		$('#overlay').fadeOut(300);
	});
	
	// Updaters
	$(window).resize(function(e){editor.resizeCanvas(); });
});