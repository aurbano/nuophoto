/*	- Workspace -
 *	Layer to interact with the workspace, opening and closing menus
 *  history functions, layers...
 *
 *	It should only take care of gui interaction, all other behavior
 *	will be done in main.js
 */
var workspace = {
	files : {}, 	// Will hold editor references, layers and history information
	current : -1,	// Current must always point to element in focus
	
	newFile : function(s){
		this.current++;
		var id = 'file'+this.current;
		$('<div class="window file active scrollbars" style="position:absolute; top:100px;"><div class="overlay"></div><div class="status"></div><div class="topInfo"><div class="filename">File '+(this.current+1)+'</div><div class="fileops"><a href="#closeFile" rel="'+this.current+'"><i class="icon-circle-blank icon-large"></i></a></div></div><div class="box"><canvas width="100%" height="100%" id="'+id+'" style="color:#09F"></canvas></div></div>').appendTo('#workspace').draggable({
			handle: '.topInfo',
			stack: ".file",
			start: function(event, ui) {
				var id = $(this).find("a[href='#closeFile']").attr('rel');
				if(id == workspace.current) return true;
				workspace.current = id;
				if(id !== undefined) return workspace.switchFile(id);
				return true;
			}
		}).resizable({
			minHeight : 100,
			minWidth : 200
		}).bind('click',function(){
			var id = $(this).find("a[href='#closeFile']").attr('rel');
			workspace.current = id;
			workspace.switchFile(id);
		});
		//
		var editor = new imgEditor('#'+id);
		editor.resizeCanvas(400,500);
		editor.background('#efefef');
		// Create and return new imgEditor for this file
		this.files[this.current] = {
			'src' : null,
			'editor' : editor,
			'layers' : new Array(),
			'history' : new Array()
		};
		this.switchFile(this.current);
		this.addHistory('New file','#3FC230'); // Initial background layer
		this.addLayer('<i class="picker" style="background:#efefef"></i> Background','#3FC230'); // Initial background layer
		// Colorpicker on the picker
		$('.picker').ColorPicker({
			color : 'efefef',
			onChange: function (hsb, hex, rgb) {
				$('.picker').css('backgroundColor', '#' + hex);
				editor.background('#' + hex);
			}
		});
		return true;
	},
	
	loadFile : function(src){
		// Set initial size
		var wk = this;
		if(this.files[this.current] == undefined){
			this.displayError('You must create a new file first');
		}
		this.setStatus('Loading image');
		this.files[this.current].editor.load(src, function(){
			wk.clearStatus();
			wk.addLayer('New layer','#C30'); // Initial background layer
			wk.addHistory('Open photo','#C30'); // Initial background layer
		});
	},
	
	closeFile : function(num){
		delete this.files[num];
		this.cleanMenus();
	},
	
	switchFile : function(num){
		this.cleanMenus();
		$('.file').removeClass('active');
		$('#file'+num).parents('.file').addClass('active');
		this.bringFront($('#file'+num).parents('.file'));
		// Redraw
		for(var i=0;i<this.files[this.current].layers.length;i++){
			this.drawLayer(i);
		}
		
		for(var i=0;i<this.files[this.current].history.length;i++){
			this.drawHistory(i);
		}		
		return true;
	},
	
	editor : function(){
		return this.files[this.current].editor;
	},
	
	addLayer : function(name, color){
		this.files[this.current].layers.push({'name' : name, 'color' : color});
		this.drawLayer(this.files[this.current].layers.length-1);
	},
	
	drawLayer : function(num){
		var span = '',
			eye='',
			total = this.files[this.current].layers.length,
			name = this.files[this.current].layers[num].name,
			color = this.files[this.current].layers[num].color;
		if(total > 1){
			eye = '<i class="icon-eye-open icon-large"></i> ';
			span = '<span><i class="icon-trash"></span>';
		}
		$('<li><a href="#layers" rel="'+(total-1)+'" style="border-left:'+color+' solid 3px">'+eye+name+span+'</a></li>').prependTo('#layers');
	},
	
	addHistory : function(name, color){
		this.files[this.current].history.push({'name' : name, 'color' : color});
		this.drawHistory(this.files[this.current].history.length-1);	
	},
	
	drawHistory : function(num){
		var total = this.files[this.current].history.length,
			name = this.files[this.current].history[num].name,
			color = this.files[this.current].history[num].color;;
		$('<li><a href="#history" rel="'+(total-1)+'" style="border-left:'+color+' solid 3px" title="Go back">'+name+'</a></li>').prependTo('#history');
	},
	
	removeLayer : function(index){
		this.addHistory('Delete '+this.files[this.current].layers[index].name,this.files[this.current].layers[index].color);
		this.files[this.current].layers.splice(index,1);
		$("#layers a[rel='"+index+"']").parent('li').remove();
	},
	
	displayError : function(text){
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
	},
	
	displayGallery : function(){
		$('#overlay').fadeIn(300, function(){
			$('#gallery').show();
		});
	},
	
	displayWebPhoto : function(){
		$('#overlay').fadeIn(300, function(){
			$('#webPhoto').show();
		});
	},
	
	closeMenus : function(){
		$('#navBar ul').slideUp(100);
		$('#navBar h3 i').removeClass('icon-caret-down').addClass('icon-caret-right');	
	},
	
	resizeEditor : function(){
		// Overlay
		$('#overlay').css({width : $(window).width(), height : $(window).height()});
		// Layers and history
		var height = $(window).height();
		var h2 = $('#config h2').height();
		$('ul#history').css({'height' : Math.ceil(height/3)});
		$('#layersContainer').css({'height' : Math.floor(height - height/3 - 3.5*h2)});	
	},
	
	cleanMenus : function(){
		$('#layers').html('');
		$('#history').html('');
	},
	
	saveImage : function(){
		var saved = this.files[this.current].editor.save();
		window.open(saved, "Image | nuophoto", "width=600, height=400");
	},
	
	clearStatus : function(){
		$('.file .status').text('').hide();
	},
	
	setStatus : function(text){
		$('#file'+this.current).parents('.file').find('.status').text(text).show();
	},
	
	bringFront : function(elem){
		// Brings a file to the stack front
		var min, group = $('.file');
		
		if(group.length < 1) return;

		min = parseInt(group[0].style.zIndex, 10) || 0;
		$(group).each(function(i) {
			this.style.zIndex = min + i;
		});
		
		if(elem == undefined) return;

		$(elem).css({'zIndex' : min + group.length});
	}
};