/*  - Workspace -
 *  Layer to interact with the workspace, opening and closing menus
 *  history functions, layers...
 *
 *  It should only take care of gui interaction, all other behavior
 *  will be done in main.js
 */
define(["jquery", "jqueryui", "imgEditor", "colorpicker"], function($) {

  var wk = {
    files: {}, // Will hold editor references, layers and history information
    current: -1, // Current must always point to element in focus
    currentEffect: null // Effect being applied, acts as memory when waiting for user input on the customizer window
  };

  wk.file = {
    /**
     * Create a new empty file
     */
    create: function(height, width) {
      wk.current++;
      if (typeof height === 'undefined' || typeof width === 'undefined') {
        height = 100;
        width = 100;
      }
      var id = 'file' + wk.current;
      var elem = $('<div class="window file active scrollbars" style="position:absolute; top:100px;"><div class="overlay"></div><div class="status"></div><div class="topInfo"><div class="filename">File ' + (wk.current + 1) + ' <span class="zoom">[100%]</span></div> <div class="fileops"><a href="#closeFile" title="Close file" rel="' + wk.current + '"><i class="fa fa-times"> </i> </a> </div> </div> <div class="box"><canvas width="100%" height="100%" id="' + id + '" style="color:#09F"></canvas></div></div>').appendTo('#workspace').draggable({
        handle: '.topInfo',
        stack: ".file",
        start: function(event, ui) {
          var id = $(this).find("a[href='#closeFile']").attr('rel');
          if (id == wk.current) return true;
          wk.current = id;
          if (typeof id !== 'undefined') return workspace.switchFile(id);
          return true;
        }
      }).resizable({
        minHeight: 50,
        minWidth: 100,
        resize: function() {
          wk.file.fixMargin();
        }
      }).bind('click', function() {
        var id = $(this).find("a[href='#closeFile']").attr('rel');
        wk.current = id;
        wk.file.change(id);
      });

      // TODO Not being used at the moment, needs fixing
      //$('#'+id).get(0).addEventListener('DOMMouseScroll',this.handleScroll,false);
      //$('#'+id).get(0).addEventListener('mousewheel',this.handleScroll,false);

      // New imgEditor reference
      var editor = new imgEditor('#' + id);
      editor.resizeCanvas(height, width);
      editor.background('#efefef');
      // Setup the properties and store
      wk.files[wk.current] = {
        'elem': elem,
        'zoom': 1,
        'src': null,
        'editor': editor,
        'layers': new Array(),
        'history': new Array()
      };
      // Change to the new file
      wk.file.change(wk.current);
      // Center file
      wk.file.fixMargin();
    },

    /**
     * Load a new image inside the currently focused file.
     * If there is no file selected it will create it.
     * It will also resize the file if it is smaller
     * @param {String} Image source
     */
    load: function(src) {
      // Set initial size
      if (typeof wk.files[wk.current] === 'undefined') {
        // Create a new file and select it
        wk.file.create(1, 1);
      }
      wk.status.set('Loading image');
      // Call the imgEditor load method
      wk.files[wk.current].editor.load(src, function() {
        // Center the canvas
        var id = 'file' + wk.current,
          h = $('#' + id).height(),
          w = $('#' + id).width();
        $('#' + id).css({
          marginTop: -h / 2,
          marginLeft: -w / 2
        });
        wk.status.clear();
        // File loaded layer
        wk.layer.add('New layer', '#C30', wk.editor().getCanvas('main'));
        // File loaded event in history
        wk.history.add('Open photo', '#C30');
        wk.file.fixMargin();
      });
    },

    /**
     * Apply zoom to the selected file
     * @param {float} Scale to apply, where 1 is no zoom. 1.5 would be an increase of 50%.
     */
    zoom: function(scale) {
      if (typeof wk.files[wk.current] === 'undefined') {
        return;
      }
      // Update zoom for display
      wk.files[wk.current].zoom += scale - 1;
      $(wk.files[wk.current].elem).find('.zoom').text('[' + wk.files[wk.current].zoom * 100 + '%]');
      // Apply zoom
      wk.files[wk.current].editor.zoom(scale);
      // Fix margins
      wk.file.fixMargin();
    },

    /**
     * Fix the margins to keep the image always centered if possible. If the viewport
     * is smaller than the image, then it will be stuck to the top-left corner. 
     */
    fixMargin: function() {
      if (typeof wk.files[wk.current] === 'undefined') {
        return;
      }
      $(wk.files[wk.current].elem).find('canvas').css({
        'marginTop': -Math.min(
          $(wk.files[wk.current].elem).find('canvas').height() / 2,
          $(wk.files[wk.current].elem).find('.box').height() / 2
        ),
        'marginLeft': -Math.min(
          $(wk.files[wk.current].elem).find('canvas').width() / 2,
          $(wk.files[wk.current].elem).find('.box').width() / 2
        )
      });
    },

    /**
     * Close the specified file. 
     * @param {int} File identifier
     */
    close: function(num) {
      delete wk.files[num];
      wk.cleanMenus();
      $('#layerOpts').hide();
    },

    /**
     * Change files, this will ensure that all views and variables are updated accordingly.
     * @param {int} File identifier
     */
    change: function(num) {
      wk.cleanMenus();
      $('.file').removeClass('active');
      $('#file' + num).parents('.file').addClass('active');
      wk.file.bringFront($('#file' + num).parents('.file'));
      // Redraw
      for (var i = 0; i < wk.files[wk.current].layers.length; i++) {
        wk.layer.draw(i);
      }

      for (var i = 0; i < wk.files[wk.current].history.length; i++) {
        wk.history.draw(i);
      }
      return true;
    },

    /**
     * Bring a file to the front (by setting the z-index) 
     * @param {$} jQuery element
     */
    bringFront: function(elem) {
      // Brings a file to the stack front
      var min, group = $('.file');

      if (group.length < 1) return;

      min = parseInt(group[0].style.zIndex, 10) || 0;
      $(group).each(function(i) {
        this.style.zIndex = min + i;
      });

      if (typeof elem === 'undefined') return;

      $(elem).css({
        'zIndex': min + group.length
      });
    }
  };

  /**
   * Reference to current image editor 
   */
  wk.editor = function() {
    return wk.files[wk.current].editor;
  };

  /**
   * The customizer is the generic container
   * for effect parameters. 
   */
  wk.customizer = {
    /**
     * Display and fill in the values of the customizer
     * window 
     */
    open: function(title, params) {
      $('#customizer fieldset').html('');
      wk.file.bringFront($('#customizer'));
      for (var i = 0; i < params.length; i++) {
        var param = params[i],
          input;
        // Prepare the input based on the type
        switch (param.type) {
          case 'number':
            input = '<input type="' + param.type + '" name="' + param.name + '" value="' + param.value + '"/>';
            break;
          case 'range':
            input = '<input type="range" name="' + param.name + '" value="' + param.value + '" min="' + param.options.min + '" max="' + param.options.max + '">';
            break;
        }
        $('#customizer fieldset').append('<label>' + param.display + '<br />' + input + '</label>');
      }
      $('#customizer').show().find('.filename').text(title);
    },
    /**
     * Close the customizer window
     * @param {Array} Configuration parameters
     */
    close: function(params) {
      $('#customizer').hide();
      wk.status.clear();
    },
  };

  wk.effect = {
    /**
     * Initiate the requested effect, if it requires parameters
     * it will call the customizer window
     * @param {String} Effect name, in the scripts folder
     * @param {String} Effect name for display
     * @param {String} Color for history and layer views
     */
    call: function(effect, name, color) {
      // Check if effect has configuration requirements
      wk.status.set('Waiting for input...');
      require(["effects/" + effect], function() {
        if (parameters.length == 0) {
          wk.effect.apply(effect, false, name, color);
        } else {
          wk.customizer.open(name + ' options', parameters);
          // Store the effect in memory
          wk.currentEffect = {
            effect: effect,
            name: name,
            params: parameters
          };
        }
      });
    },

    /**
     * Applies the requested effect, if it has effects it will parse the contents
     * of the customizer window
     * @param {String} Effect name
     * @param {Boolean} true if it requires configuration
     */
    apply: function(effect, hasConfig, name, color) {
      var params = [];
      if (hasConfig) {
        // Load the corresponding parameters from the Customizer window
        // TODO Support for checkboxes and radio buttons
        $('#customizer input').each(function() {
          params[$(this).attr('name')] = parseInt($(this).val());
        });
      }
      wk.status.set('Applying ' + name + '...');
      wk.editor().applyEffect(effect, params, function() {
        // Draw the buffer content to the main canvas
        wk.editor().drawToMain();
        // Add the layer, with the buffer data included
        wk.layer.add(name, color, wk.editor().getCanvas('buffer'));
        // And the history element
        wk.history.add(name, color);

        wk.status.clear();
        // Clear the buffer
        wk.editor().clearBuffer();
      });
    },
  };

  wk.layer = {
    /**
     * Index of the currently selected layer 
     */
    selected: -1,

    /**
     * Add a new layer to the workspace 
     * @param {String} Layer name
     * @param {String} Layer color, each layer type should use a different color to be identified more easily.
     * @param {Object} Layer contents, as in the buffer state
     */
    add: function(name, color, data) {
      // Create and store a new layer object
      wk.files[wk.current].layers.push({
        'name': name,
        'color': color,
        'data': data,
        'hidden': false,
        'opacity': 1,
        'blendingMode': 'normal'
      });
      // Display inside the layer list
      var index = wk.files[wk.current].layers.length - 1;
      wk.layer.draw(index);
      wk.layer.select(index);

    },

    /**
     * Add the layer to the DOM 
     * @param {int} Layer number
     */
    draw: function(num) {
      if (typeof wk.files[wk.current].layers[num] === 'undefined') {
        console.error("Layer " + num + " doesnt exist");
        return;
      }
      var span = '',
        eye = '',
        total = wk.files[wk.current].layers.length,
        name = wk.files[wk.current].layers[num].name,
        color = wk.files[wk.current].layers[num].color;
      if (total > 0) {
        eye = '<span class="toggle"><i class="fa fa-eye fa-lg"></i></span> ';
        span = '<span class="delete right"><i class="fa fa-trash-o"></span>';
      }
      $('<li><a href="#layers" rel="' + num + '" style="border-left:' + color + ' solid 3px">' + eye + name + span + '</a></li>').prependTo('#layers');
    },

    /**
     * Remove a layer from the current file
     * The layer is deleted from the array, so all other preserve their index
     * @param {int} Layer number
     */
    remove: function(index) {
      var file = wk.files[wk.current];
      wk.history.add('Delete ' + file.layers[index].name, file.layers[index].color);
      delete file.layers[index];
      $("#layers a[rel='" + index + "']").parent('li').remove();
      wk.redraw();
    },

    /**
     * Hides/Shows the specified layer and redraws the canvas
     * @param {int} Layer number
     */
    toggle: function(index) {
      var file = wk.files[wk.current];

      if (file.layers[index].hidden) {
        file.layers[index].hidden = false;
        wk.history.add('Show ' + file.layers[index].name, file.layers[index].color);
        $("#layers a[rel='" + index + "']").removeClass('hidden');
        $("#layers a[rel='" + index + "']").find("i.fa-eye-slash").removeClass('fa-eye-slash').addClass("fa-eye");
      } else {
        file.layers[index].hidden = true;
        wk.history.add('Hide ' + file.layers[index].name, file.layers[index].color);
        $("#layers a[rel='" + index + "']").addClass('hidden');
        $("#layers a[rel='" + index + "']").find("i.fa-eye").removeClass('fa-eye').addClass("fa-eye-slash");
      }

      wk.redraw();
    },

    /**
     * Select the specified layer. This will allow certain operations to be performed
     * like adjusting the opacity or the blending modes 
     */
    select: function(index) {
      // Deselect the previous one
      $('#layers li > a').removeClass("active");
      wk.layer.selected = index;
      $("#layers a[rel='" + index + "']").addClass('active');
      $('#layerOpts').show();
      // Reset opacity content
      $('#opacity').val(wk.files[wk.current].layers[index].opacity * 100);
      $('#blendingMode option[value="' + wk.files[wk.current].layers[index].blendingMode + '"]').attr('selected', 'selecteds');
    },

    /**
     * Set layer parameters, only the existing ones are modified.
     * If no layer is specified, it uses the selected layer.
     * @param {Object} List of parameters to be set 
     */
    set: function(params, layer) {
      if (typeof layer === 'undefined' || layer < 0) {
        layer = wk.layer.selected;
        if (layer < 0) return;
      }
      // Current file
      var file = wk.files[wk.current];
      // Now iterate the parameters and set them
      for (var param in params) {
        file.layers[layer][param] = params[param];
      }
      wk.redraw();
    }
  };

  /**
   * Redraw a file using the data from each layer.
   * If a layer is deleted it will be undefined, and if it's hidden
   * it will have hidden set to true.
   */
  wk.redraw = function() {
    var layers = wk.files[wk.current].layers,
      editor = wk.editor();
    editor.clear();
    for (var i = 0; i < layers.length; i++) {
      if (typeof layers[i] === 'undefined' || layers[i].hidden)
        continue;
      editor.drawToMain(layers[i].data, layers[i].opacity, layers[i].blendingMode);
    }
  };

  /**
   * Handle the history event list. At the moment this only
   * displays the performed events, there is no going back. 
   */
  wk.history = {
    /**
     * Add an event to the history log 
     * @param {String} Event name
     * @param {String} Event color, each event type should use a different color to be identified more easily.
     */
    add: function(name, color) {
      wk.files[wk.current].history.push({
        'name': name,
        'color': color
      });
      wk.history.draw(wk.files[wk.current].history.length - 1);
    },

    /**
     * Add the history element to the DOM 
     * @param {int} Event number
     */
    draw: function(num) {
      var total = wk.files[wk.current].history.length,
        name = wk.files[wk.current].history[num].name,
        color = wk.files[wk.current].history[num].color;;
      $('<li><a href="#history" rel="' + (total - 1) + '" style="border-left:' + color + ' solid 3px" title="Go back">' + name + '</a></li>').prependTo('#history');
    }
  };

  /**
   * Display an error fullscreen. 
   * @param {String} Error text
   */
  wk.displayError = function(text) {
    $('#gallery').fadeOut(300);
    $('#webPhoto').fadeOut(300);
    $('#overlay').fadeIn(300, function() {
      $('#errorText').html(text);
      $('#error').show();
      setTimeout(function() {
        $('#error').fadeOut(300);
        $('#overlay').fadeOut(300);
      }, 3000);
    });
  };

  /**
   * Display the photo gallery 
   */
  wk.displayGallery = function() {
    $('#overlay').fadeIn(300, function() {
      $('#gallery').show();
    });
  };

  /**
   * Display the load from URL menu 
   */
  wk.displayWebPhoto = function() {
    $('#overlay').fadeIn(300, function() {
      $('#webPhoto').show();
      $('#loadFromUrl').focus();
    });
  };

  /**
   * Close all menus 
   */
  wk.closeMenus = function() {
    $('#navBar ul').slideUp(100);
    $('#navBar h3 > i').removeClass('fa-caret-down').addClass('fa-caret-right');
  };

  /**
   * Resize the editor to fit screen
   */
  wk.resizeEditor = function() {
    // Overlay
    $('#overlay').css({
      width: $(window).width(),
      height: $(window).height()
    });
    // Layers and history
    var height = $(window).height();
    var h2 = $('#config h2').height();
    $('ul#history').css({
      'height': Math.ceil(height / 3)
    });
    $('#layersContainer').css({
      'height': Math.floor(height - height / 3 - 3.5 * h2)
    });
  };

  /**
   * Clear the layer and history menus 
   */
  wk.cleanMenus = function() {
    $('#layers').html('');
    $('#history').html('');
  };

  /**
   * Save the image on the current editor. It opens a pop-up window
   * with the contents of the file as an image.
   */
  wk.saveImage = function() {
    if (typeof wk.files[wk.current] === 'undefined') {
      return;
    }
    var editor = wk.files[wk.current].editor,
      saved = editor.save();
    window.open(saved, "nuophoto", "width=" + (editor.canvas.WIDTH) + ", height=" + (editor.canvas.HEIGHT) + ", toolbar=0, scrollbars=0, menubar=0, status=0, titlebar=0, resizable=0");
  };

  /**
   * This handles the status message at the bottom left corner
   * of every file. 
   */
  wk.status = {
    /**
     * Set file status text, possibly useful to display information while an effect is being applied. 
     * @param {String} Status text
     */
    set: function(text) {
      $('#file' + wk.current).parents('.file').find('.status').text(text).show();
    },
    /**
     * Clear the status text
     */
    clear: function() {
      $('.file .status').text('').hide();
    },
  };

  /**
   * Zoom with the scrollwheel.
   * //TODO not working nor being used at the moment
   * @param {Event} Scroll event
   */
  wk.handleScroll = function(evt) {
    return;
    var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0,
      x = evt.clientX,
      y = evt.clientY;
    if (delta) workspace.files[workspace.current].editor.zoom(delta, x, y);
    return evt.preventDefault() && false;
  };

  return wk;
});
