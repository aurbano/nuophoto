/*	- Workspace -
 *	Layer to interact with the workspace, opening and closing menus
 *  history functions, layers...
 *
 *	It should only take care of gui interaction, all other behavior
 *	will be done in main.js
 */
define(["jquery", "jqueryui", "imgEditor", "colorpicker"], function($) {
	
	var wk = {
		files : {}, 	// Will hold editor references, layers and history information
		current : -1,	// Current must always point to element in focus
		effect : null	// Effect being applied, acts as memory when waiting for user input on the customizer window
	};
	
	/**
	 * Create a new empty file
	 */
	wk.newFile = function(){
		wk.current++;
		var id = 'file'+wk.current;
		var elem = $('<div class="window file active scrollbars" style="position:absolute; top:100px;"><div class="overlay"></div><div class="status"></div><div class="topInfo"><div class="filename">File ' + (wk.current+1) + ' <span class="zoom">[100%]</span></div> <div class="fileops"><a href="#closeFile" title="Close file" rel="' + wk.current + '"><i class="icon-circle-blank icon-large"> </i> </a> </div> </div> <div class="box"><canvas width="100%" height="100%" id="' + id + '" style="color:#09F"></canvas></div></div>').appendTo('#workspace').draggable({
			handle: '.topInfo',
			stack: ".file",
			start: function(event, ui) {
				var id = $(this).find("a[href='#closeFile']").attr('rel');
				if(id == wk.current) return true;
				wk.current = id;
				if(id !== undefined) return workspace.switchFile(id);
				return true;
			}
		}).resizable({
			minHeight : 100,
			minWidth : 200,
			resize : function(){
				wk.fixMargin();
			}
		}).bind('click',function(){
			var id = $(this).find("a[href='#closeFile']").attr('rel');
			wk.current = id;
			wk.switchFile(id);
		});
		
		$('#'+id).get(0).addEventListener('DOMMouseScroll',this.handleScroll,false);
		$('#'+id).get(0).addEventListener('mousewheel',this.handleScroll,false);
		
		//
		var editor = new imgEditor('#'+id);
		editor.resizeCanvas(400,500);
		editor.background('#efefef');
		// Create and return new imgEditor for this file
		wk.files[wk.current] = {
			'elem' : elem,
			'zoom' : 1,
			'src' : null,
			'editor' : editor,
			'layers' : new Array(),
			'history' : new Array()
		};
		// Change to the new file
		wk.switchFile(wk.current);
		// Initial background layer
		wk.addHistory('New file','#3FC230');
		// Initial background layer
		wk.addLayer('<i class="picker" style="background:#efefef"></i> Background','#3FC230');
		// Changable background color via Colorpicker
		$('.picker').ColorPicker({
			color : 'efefef',
			onChange : function (hsb, hex, rgb) {
				$('.picker').css('backgroundColor', '#' + hex);
				editor.background('#' + hex);
			}
		});
	};
	
	/**
	 * Load a new image inside the currently focused file.
	 * If there is no file selected it will create it. 
	 * @param {String} Image source
	 */
	wk.loadFile = function(src){
		// Set initial size
		if(wk.files[wk.current] == undefined){
			// Create a new file and select it
			wk.newFile();
		}
		wk.setStatus('Loading image');
		wk.files[wk.current].editor.load(src, function(){
			// Center the canvas
			var id = 'file'+wk.current,
				h = $('#'+id).height(),
				w = $('#'+id).width();
			$('#'+id).css({ marginTop : -h/2, marginLeft : -w/2});
			wk.clearStatus();
			wk.addLayer('New layer','#C30'); // Initial background layer
			wk.addHistory('Open photo','#C30'); // Initial background layer
			wk.fixMargin();
		});
	};
	
	/**
	 * Apply zoom to the selected file
 	 * @param {float} Scale to apply, where 1 is no zoom. 1.5 would be an increase of 50%.
	 */
	wk.zoom = function(scale){
		if(wk.files[wk.current] == undefined){
			return;
		}
		// Update zoom for display
		wk.files[wk.current].zoom += scale-1;
		$(wk.files[wk.current].elem).find('.zoom').text('['+wk.files[wk.current].zoom*100+'%]');
		// Apply zoom
		wk.files[wk.current].editor.zoom(scale);
		// Fix margins
		wk.fixMargin();
	};
	
	/**
	 * Fix the margins to keep the image always centered if possible. If the viewport
	 * is smaller than the image, then it will be stuck to the top-left corner. 
	 */
	wk.fixMargin = function(){
		if(wk.files[wk.current] == undefined){
			return;
		}
		$(wk.files[wk.current].elem).find('canvas').css({
			'marginTop' : -Math.min(
				$(wk.files[wk.current].elem).find('canvas').height()/2,
				$(wk.files[wk.current].elem).find('.box').height()/2
			),
			'marginLeft': -Math.min(
				$(wk.files[wk.current].elem).find('canvas').width()/2,
				$(wk.files[wk.current].elem).find('.box').width()/2
			)
		});
	};
	
	/**
	 * Close the specified file. 
 	 * @param {int} File identifier
	 */
	wk.closeFile = function(num){
		delete wk.files[num];
		wk.cleanMenus();
	};
	
	/**
	 * Change files, this will ensure that all views and variables are updated accordingly.
 	 * @param {int} File identifier
	 */
	wk.switchFile = function(num){
		wk.cleanMenus();
		$('.file').removeClass('active');
		$('#file'+num).parents('.file').addClass('active');
		wk.bringFront($('#file'+num).parents('.file'));
		// Redraw
		for(var i=0;i<wk.files[wk.current].layers.length;i++){
			wk.drawLayer(i);
		}
		
		for(var i=0;i<wk.files[wk.current].history.length;i++){
			wk.drawHistory(i);
		}		
		return true;
	};
	
	/**
	 * Reference to current image editor 
	 */
	wk.editor = function(){
		return wk.files[wk.current].editor;
	};
	
	/**
	 * Display and fill in the values of the customizer
	 * window 
	 */
	wk.openCustomizer = function(title,params){
		$('#customizer fieldset').html('');
		wk.bringFront($('#customizer'));
		for(var i=0;i<params.length;i++){
			var param = params[i],
				input;
			// Prepare the input based on the type
			switch(param.type){
				case 'number':
					input = '<input type="'+param.type+'" name="'+param.name+'" value="'+param.value+'"/>';
					break;
				case 'range':
					input = '<input type="range" name="'+param.name+'" value="'+param.value+'" min="'+param.options.min+'" max="'+param.options.max+'">';
					break;
			}
			$('#customizer fieldset').append('<label>'+param.display+'<br />'+input+'</label>');
		}
		$('#customizer').show().find('.filename').text(title);
	};
	
	/**
	 * Close the customizer window
	 * @param {Array} Configuration parameters
	 */
	wk.closeCustomizer = function(params){
		$('#customizer').hide();
		wk.clearStatus();
	};
	
	/**
	 * Initiate the requested effect, if it requires parameters
	 * it will call the customizer window
	 * @param {String} Effect name, in the scripts folder
	 * @param {String} Effect name for display
	 * @param {String} Color for history and layer views
	 */
	wk.callEffect = function(effect, name, color){
		// Check if effect has configuration requirements
		wk.setStatus('Waiting for input...');
		require(["effects/"+effect], function(){
			if(parameters.length == 0){
				wk.applyEffect(effect, false, name, color);
			}else{
				wk.openCustomizer(effect+' options', parameters);
				// Store the effect in memory
				wk.effect = {
					name : effect,
					params : parameters
				};
			}
		});
	};
	
	/**
	 * Applies the requested effect, if it has effects it will parse the contents
	 * of the customizer window
	 * @param {String} Effect name
	 * @param {Boolean} true if it requires configuration
	 */
	wk.applyEffect = function(effect, hasConfig, name, color){
		var params = [];
		if(hasConfig){
			// Load the corresponding parameters from the Customizer window
			// TODO Support for checkboxes and radio buttons
			$('#customizer input').each(function(){
				params[$(this).attr('name')] = parseInt($(this).val());
			});
		}
		wk.setStatus('Applying '+effect+'...');
		wk.editor().applyEffect(effect, params, function(){
			console.log("Effect applied, drawing from buffer to canvas");
			// Draw the buffer content to the main canvas
			wk.editor().drawToMain();
			// Add the layer, with the buffer data included
			wk.addLayer(effect,color,wk.editor().buffer.elem);
			// And the history element
			wk.addHistory(effect,color);
			// Store the buffer in the history element
			wk.clearStatus();
		});
	};
	
	/**
	 * Add a new layer to the workspace 
 	 * @param {String} Layer name
 	 * @param {String} Layer color, each layer type should use a different color to be identified more easily.
 	 * @param {Object} Layer contents, as in the buffer state
	 */
	wk.addLayer = function(name, color, data){
		wk.files[wk.current].layers.push({'name' : name, 'color' : color, 'data' : data});
		wk.drawLayer(wk.files[wk.current].layers.length-1);
	};
	
	/**
	 * Add the layer to the DOM 
 	 * @param {int} Layer number
	 */
	wk.drawLayer = function(num){
		var span = '',
			eye='',
			total = wk.files[wk.current].layers.length,
			name = wk.files[wk.current].layers[num].name,
			color = wk.files[wk.current].layers[num].color;
		if(total > 1){
			eye = '<i class="icon-eye-open icon-large"></i> ';
			span = '<span><i class="icon-trash"></span>';
		}
		$('<li><a href="#layers" rel="'+(total-1)+'" style="border-left:'+color+' solid 3px">'+eye+name+span+'</a></li>').prependTo('#layers');
	};
	
	/**
	 * Add an event to the history log 
	 * @param {String} Event name
	 * @param {String} Event color, each event type should use a different color to be identified more easily.
	 */
	wk.addHistory = function(name, color){
		wk.files[wk.current].history.push({'name' : name, 'color' : color});
		wk.drawHistory(wk.files[wk.current].history.length-1);	
	};
	
	/**
	 * Add the history element to the DOM 
 	 * @param {int} Event number
	 */
	wk.drawHistory = function(num){
		var total = wk.files[wk.current].history.length,
			name = wk.files[wk.current].history[num].name,
			color = wk.files[wk.current].history[num].color;;
		$('<li><a href="#history" rel="'+(total-1)+'" style="border-left:'+color+' solid 3px" title="Go back">'+name+'</a></li>').prependTo('#history');
	},
	
	/**
	 * Remove a layer from the current file
	 * // TODO Redraw canvas without this layer 
 	 * @param {int} Layer number
	 */
	wk.removeLayer = function(index){
		wk.addHistory('Delete '+wk.files[wk.current].layers[index].name,wk.files[wk.current].layers[index].color);
		wk.files[wk.current].layers.splice(index,1);
		$("#layers a[rel='"+index+"']").parent('li').remove();
	};
	
	/**
	 * Display an error fullscreen. 
 	 * @param {String} Error text
	 */
	wk.displayError = function(text){
		$('#gallery').fadeOut(300);
		$('#webPhoto').fadeOut(300);
		$('#overlay').fadeIn(300, function(){
			$('#errorText').html(text);
			$('#error').show();
			setTimeout(function(){
				$('#error').fadeOut(300);
				$('#overlay').fadeOut(300);
			},3000);
		});
	};
	
	/**
	 * Display the photo gallery 
	 */
	wk.displayGallery = function(){
		$('#overlay').fadeIn(300, function(){
			$('#gallery').show();
		});
	};
	
	/**
	 * Display the load from URL menu 
	 */
	wk.displayWebPhoto = function(){
		$('#overlay').fadeIn(300, function(){
			$('#webPhoto').show();
		});
	};
	
	/**
	 * Close all menus 
	 */
	wk.closeMenus = function(){
		$('#navBar ul').slideUp(100);
		$('#navBar h3 i').removeClass('icon-caret-down').addClass('icon-caret-right');	
	};
	
	/**
	 * Resize the editor (fluid layout) 
	 */
	wk.resizeEditor = function(){
		// Overlay
		$('#overlay').css({width : $(window).width(), height : $(window).height()});
		// Layers and history
		var height = $(window).height();
		var h2 = $('#config h2').height();
		$('ul#history').css({'height' : Math.ceil(height/3)});
		$('#layersContainer').css({'height' : Math.floor(height - height/3 - 3.5*h2)});	
	};
	
	/**
	 * Clear the menus 
	 */
	wk.cleanMenus = function(){
		$('#layers').html('');
		$('#history').html('');
	};
	
	/**
	 * Save the image on the current editor 
	 */
	wk.saveImage = function(){
		if(wk.files[wk.current] == undefined){
			return;
		}
		var saved = wk.files[wk.current].editor.save();
		window.open(saved, "Image | nuophoto", "width=600, height=400");
	};
	
	/**
	 * Clear the status text
	 */
	wk.clearStatus = function(){
		$('.file .status').text('').hide();
	};
	
	/**
	 * Set status text, possibly useful to display information while an effect is being applied. 
 	 * @param {String} Status text
	 */
	wk.setStatus = function(text){
		$('#file'+wk.current).parents('.file').find('.status').text(text).show();
	};
	
	/**
	 * Bring a file to the front (by setting the z-index) 
 	 * @param {$} jQuery element
	 */
	wk.bringFront = function(elem){
		// Brings a file to the stack front
		var min, group = $('.file');
		
		if(group.length < 1) return;

		min = parseInt(group[0].style.zIndex, 10) || 0;
		$(group).each(function(i) {
			this.style.zIndex = min + i;
		});
		
		if(elem == undefined) return;

		$(elem).css({'zIndex' : min + group.length});
	};
	
	/**
	 * Zoom with the scrollwheel 
 	 * @param {Event} Scroll event
	 */
	wk.handleScroll = function(evt){
		return;
		var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0,
			x = evt.clientX,
			y = evt.clientY;
		if (delta) workspace.files[workspace.current].editor.zoom(delta, x, y);
		return evt.preventDefault() && false;
	};
	
	return wk;
});