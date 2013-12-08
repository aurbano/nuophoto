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
		current : -1	// Current must always point to element in focus
	};
	
	/**
	 * Create a new file for an image 
 	 * @param {Object} s
	 */
	wk.newFile = function(s){
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
		return true;
	};
	
	wk.loadFile = function(src){
		// Set initial size
		if(wk.files[wk.current] == undefined){
			wk.displayError('You must create a new file first');
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
	
	wk.closeFile = function(num){
		delete wk.files[num];
		wk.cleanMenus();
	};
	
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
	
	wk.editor = function(){
		return wk.files[wk.current].editor;
	};
	
	wk.addLayer = function(name, color){
		wk.files[wk.current].layers.push({'name' : name, 'color' : color});
		wk.drawLayer(wk.files[wk.current].layers.length-1);
	};
	
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
	
	wk.addHistory = function(name, color, data){
		if(data==undefined) data = false;
		wk.files[wk.current].history.push({'name' : name, 'color' : color, 'data' : data});
		wk.drawHistory(wk.files[wk.current].history.length-1);	
	};
	
	wk.drawHistory = function(num){
		var total = wk.files[wk.current].history.length,
			name = wk.files[wk.current].history[num].name,
			color = wk.files[wk.current].history[num].color;;
		$('<li><a href="#history" rel="'+(total-1)+'" style="border-left:'+color+' solid 3px" title="Go back">'+name+'</a></li>').prependTo('#history');
	},
	
	wk.removeLayer = function(index){
		wk.addHistory('Delete '+wk.files[wk.current].layers[index].name,wk.files[wk.current].layers[index].color);
		wk.files[wk.current].layers.splice(index,1);
		$("#layers a[rel='"+index+"']").parent('li').remove();
	};
	
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
	
	wk.displayGallery = function(){
		$('#overlay').fadeIn(300, function(){
			$('#gallery').show();
		});
	};
	
	wk.displayWebPhoto = function(){
		$('#overlay').fadeIn(300, function(){
			$('#webPhoto').show();
		});
	};
	
	wk.closeMenus = function(){
		$('#navBar ul').slideUp(100);
		$('#navBar h3 i').removeClass('icon-caret-down').addClass('icon-caret-right');	
	};
	
	wk.resizeEditor = function(){
		// Overlay
		$('#overlay').css({width : $(window).width(), height : $(window).height()});
		// Layers and history
		var height = $(window).height();
		var h2 = $('#config h2').height();
		$('ul#history').css({'height' : Math.ceil(height/3)});
		$('#layersContainer').css({'height' : Math.floor(height - height/3 - 3.5*h2)});	
	};
	
	wk.cleanMenus = function(){
		$('#layers').html('');
		$('#history').html('');
	};
	
	wk.saveImage = function(){
		var saved = wk.files[wk.current].editor.save();
		window.open(saved, "Image | nuophoto", "width=600, height=400");
	};
	
	wk.clearStatus = function(){
		$('.file .status').text('').hide();
	};
	
	wk.setStatus = function(text){
		$('#file'+wk.current).parents('.file').find('.status').text(text).show();
	};
	
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