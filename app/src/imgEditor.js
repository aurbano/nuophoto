/*  - imgEditor -
 *  A JavaScript/HTML5 canvas photo editor.
 *  All effects are in effects/ folder. 
 *  
 * If no canvas ID is set, it will apply to all canvas elements found.
 * One imgEditor instance is necessary for every image that wants to be manipulated.
 * This is the file that does the actual editing. 
 * 
 *  Requirements:
 *    - jQuery
 */
var imgEditor = function(canvasID) {

  // Config variables
  // TODO Allow user configuration of these variables
  var imgEditor = {
    strokeResolution: 5, // Pixel side of squares for resolution
    minRadius: 5, // Minimum radius
    randRadius: 5, // Max random radius extra
    randPosition: 2, // Max point position deviation
    innerMargin: 20, // Margin to each side of the canvas
    buffer: {}, // Temporary buffer
    backgroundColor: '', // Background color
  };


  // Validation
  if (canvasID == null) canvasID = 'canvas';
  if ($(canvasID).length == 0) {
    alert('File undefined');
    return false;
  }

  /**
   * Canvas data 
   */
  imgEditor.canvas = {
    elem: $(canvasID),
    ctx: $(canvasID)[0].getContext("2d"),
    WIDTH: $(canvasID).width(),
    HEIGHT: $(canvasID).height(),
    canvasMinX: $(canvasID).offset().left,
    canvasMaxX: imgEditor.canvasMinX + imgEditor.WIDTH,
    canvasMinY: $(canvasID).offset().top,
    canvasMaxY: imgEditor.canvasMinY + imgEditor.HEIGHT
  };

  /**
   * Temporary canvas data
   * This one is used by effects while they are being applied 
   */
  imgEditor.buffer.elem = document.createElement('canvas');
  imgEditor.buffer.ctx = imgEditor.buffer.elem.getContext("2d");
  imgEditor.buffer.elem.setAttribute('height', imgEditor.canvas.HEIGHT);
  imgEditor.buffer.elem.setAttribute('width', imgEditor.canvas.WIDTH);

  /**
   * Mouse tracking 
   */
  imgEditor.mouse = {
    x: imgEditor.canvas.WIDTH / 2,
    y: imgEditor.canvas.HEIGHT / 2
  };

  /**
   * Clear the canvas 
   */
  imgEditor.clear = function() {
    imgEditor.canvas.ctx.clearRect(0, 0, imgEditor.canvas.WIDTH, imgEditor.canvas.HEIGHT);
  };

  /**
   * Clear the temporary canvas 
   */
  imgEditor.clearBuffer = function() {
    imgEditor.buffer.ctx.clearRect(0, 0, imgEditor.canvas.WIDTH, imgEditor.canvas.HEIGHT);
  };

  /**
   * Define a new image 
   */
  imgEditor.img = {
    i: document.createElement('img'),
    x: 0,
    y: 0
  };

  /**
   * Load a new image 
   * @param {String} Image source
   * @param {Function} Callback, executed when the image is loaded
   */
  imgEditor.load = function(src, callback) {
    // Redefine the onload, although that might be only necessary
    // when loading the editor.
    imgEditor.img.i.onload = function() {
      // Calculate new file size if necessary
      var newW = imgEditor.canvas.WIDTH,
        newH = imgEditor.canvas.HEIGHT;
      if (imgEditor.img.i.width > imgEditor.canvas.WIDTH) newW = imgEditor.img.i.width;
      if (imgEditor.img.i.height > imgEditor.canvas.HEIGHT) newH = imgEditor.img.i.height;
      // Resize to fit
      imgEditor.resizeCanvas(newH, newW);
      // Redraw the saved data
      imgEditor.drawImage(imgEditor.img.i);
      callback.call();
    };
    imgEditor.img.i.crossOrigin = 'Anonymous';
    imgEditor.img.i.src = src;
  };

  /**
   * Return new canvas element, inside canvas specify
   * either the buffer or the main canvas.
   * This is done to provide a "snapshot" of the state of the canvas,
   * so that history and layers can be redrawn
   * @param {String} Which canvas to use: buffer or main.
   * @return {Object} Canvas element containing a copy of the specified canvas
   */
  imgEditor.getCanvas = function(useCanvas) {
    var tmp = {};
    tmp.elem = document.createElement('canvas');
    tmp.ctx = tmp.elem.getContext("2d");
    tmp.elem.setAttribute('height', imgEditor.canvas.HEIGHT);
    tmp.elem.setAttribute('width', imgEditor.canvas.WIDTH);

    switch (useCanvas) {
      case 'main':
        canvas = imgEditor.canvas.elem.get(0);
        break;
      case 'buffer':
        canvas = imgEditor.buffer.elem;
        break;
    }

    tmp.ctx.drawImage(canvas, 0, 0);

    return tmp.elem;
  };

  /**
   *  Draw image on the canvas
   * @param {Object} Image object to be drawn
   */
  imgEditor.drawImage = function(img) {
    imgEditor.canvas.ctx.drawImage(img, 0, 0);
  };

  /**
   * Set the background color 
   * @param {String} HTML color
   */
  imgEditor.background = function(color) {
    imgEditor.backgroundColor = color;

    // Now add the white canvas to its right
    imgEditor.canvas.ctx.fillStyle = color;
    imgEditor.canvas.ctx.fillRect(0, 0, imgEditor.canvas.WIDTH, imgEditor.canvas.HEIGHT);
  };

  /**
   * Resize the canvas 
   * @param {int} Height, in pixels
   * @param {int} Width, in pixels
   */
  imgEditor.resizeCanvas = function(h, w) {
    console.log("Resizing to ", h, w);

    if (typeof h === 'undefined') h = 1;
    if (typeof w === 'undefined') w = 1;

    console.log("Using ", h, w);

    imgEditor.canvas.WIDTH = w;
    imgEditor.canvas.HEIGHT = h;

    imgEditor.canvas.elem.attr('width', imgEditor.canvas.WIDTH);
    imgEditor.canvas.elem.attr('height', imgEditor.canvas.HEIGHT);

    imgEditor.buffer.elem.setAttribute('height', imgEditor.canvas.HEIGHT);
    imgEditor.buffer.elem.setAttribute('width', imgEditor.canvas.WIDTH);

    imgEditor.background(imgEditor.backgroundColor);
  };

  /**
   * Draw a circle on the canvas. 
   * @param {int} x coordinate
   * @param {int} y coordinate
   * @param {int} Circle radius
   * @param {String} Circle background color
   */
  imgEditor.circle = function(x, y, rad, color) {
    // Circulo
    imgEditor.buffer.ctx.fillStyle = color;
    imgEditor.buffer.ctx.beginPath();
    imgEditor.buffer.ctx.arc(x, y, rad, 0, Math.PI * 2, true);
    imgEditor.buffer.ctx.closePath();
    imgEditor.buffer.ctx.fill();
  };

  /**
   * Create a new random color
   * @return {String} random color in HTML format 
   */
  imgEditor.newColor = function() {
    if (!imgEditor.colorful) return '#fff';
    return '#' + Math.round(0xffffff * Math.random()).toString(16);
  };

  /**
   * Convert mouse coordinates to canvas coordinates 
   * @param {Event} Mouse move event
   */
  imgEditor.mouseMove = function(e) {
    imgEditor.mouse.s.x = Math.max(Math.min(e.pageX - imgEditor.mouse.p.x, 40), -40);
    imgEditor.mouse.s.y = Math.max(Math.min(e.pageY - imgEditor.mouse.p.y, 40), -40);

    imgEditor.mouse.p.x = e.pageX - imgEditor.canvas.canvasMinX;
    imgEditor.mouse.p.y = e.pageY - imgEditor.canvas.canvasMinY;
  };

  imgEditor.avg = [];
  imgEditor.generated = false; // Flag to know if averages have been calculated.

  /**
   * To increase speed some effects are not applied to every pixel, but to a smaller subset.
   * This is achieved by calculating a new image with less resolution, basically converting
   * every square of imgEditor.strokeResolution pixels into the average color of those pixels.
   * @param {Function} Callback
   */
  imgEditor.generateAvg = function(callback) {
    imgEditor.avg = []; // clear current avg

    // Get samples from the image with the resolution set in strokeResolution
    var pix = imgEditor.canvas.ctx.getImageData(0, 0, imgEditor.canvas.WIDTH, imgEditor.canvas.HEIGHT),
      auxAvg, points;
    //
    for (var y = 0; y < pix.height; y += imgEditor.strokeResolution) {
      for (var x = 0; x < pix.width; x += imgEditor.strokeResolution) {
        auxAvg = [0, 0, 0]; // Avg
        points = 0; // Pixels measured for avg (strokeResolution^2)
        for (var x1 = 0; x1 < imgEditor.strokeResolution; x1++) {
          if (x + x1 > pix.width) break;
          for (var y1 = 0; y1 < imgEditor.strokeResolution; y1++) {
            if (y + y1 > pix.height) break;
            // I now have all needed pointers
            // Get the index inside pix array
            var pixIndex = ((y + y1) * pix.width + x + x1) * 4;
            auxAvg[0] += pix.data[pixIndex];
            auxAvg[1] += pix.data[pixIndex + 1];
            auxAvg[2] += pix.data[pixIndex + 2];
            points++;
            //console.log(pix.data[pixIndex]);
            //debugger;
          }
        }
        // Now get final average
        auxAvg[0] = Math.round(auxAvg[0] / points);
        auxAvg[1] = Math.round(auxAvg[1] / points);
        auxAvg[2] = Math.round(auxAvg[2] / points);
        // Store
        imgEditor.avg.push(auxAvg);
      }
    }
    // Set flag
    imgEditor.generated = true;
    callback.call();
  };

  /**
   * Apply the desired effect to the canvas. The effect must be a file in the effects folder.
   * See some effects for the required format.
   * @param {String} Effect name
   * @param {Function} Callback
   */
  imgEditor.applyEffect = function(effect, params, callback) {
    require(["effects/" + effect], function() {
      var obj = imgEditor;
      if (!imgEditor.generated || (params['resolution'] !== 'undefined' && params['resolution'] !== imgEditor.strokeResolution)) {
        if (typeof params['resolution'] !== 'undefined') {
          imgEditor.strokeResolution = params['resolution'];
          // Set flag
          imgEditor.generated = false;
        }
        imgEditor.generateAvg(function() {
          exec(obj, params, function() {
            callback.call();
          });
        });
      } else {
        exec(obj, params, function() {
          callback.call();
        });
      }
    });
  };

  /**
   * Draws the contents of the canvas buffer into the main canvas
   * @param {Object} Canvas buffer element 
   */
  imgEditor.drawToMain = function(buffer, opacity, blendingMode) {
    if (typeof buffer === 'undefined') {
      buffer = imgEditor.buffer.elem;
    }
    if (typeof blendingMode === 'undefined')
      blendingMode = 'normal';
    if (typeof opacity === 'undefined' || opacity > 1 || opacity < 0)
      opacity = 1;

    imgEditor.canvas.ctx.save();
    imgEditor.canvas.ctx.globalAlpha = opacity;
    imgEditor.canvas.ctx.globalCompositeOperation = blendingMode;
    imgEditor.canvas.ctx.drawImage(buffer, 0, 0);
    imgEditor.canvas.ctx.restore();
  };

  /**
   * Save the canvas data
   * @return {String} Data URL with the canvas contents. 
   */
  imgEditor.save = function() {
    return imgEditor.canvas.elem.get(0).toDataURL();
  };

  /**
   * Apply zoom to the canvas, basically scaling it via CSS
   * @param {float} scale
   */
  imgEditor.zoom = function(scale) {
    var h = $(imgEditor.canvas.elem).height(),
      w = $(imgEditor.canvas.elem).width();

    // Resize via CSS, the canvas scale is maintained
    imgEditor.canvas.elem.css({
      height: h * scale,
      width: w * scale,
      marginTop: -h * scale / 2,
      marginLeft: -w * scale / 2
    });
  };

  return imgEditor;
};
