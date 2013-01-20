/*	- Workspace -
 *	Layer to interact with the workspace, opening and closing menus
 *  history functions, layers...
 *
 *	It should only take care of gui interaction, all other behavior
 *	will be done in main.js
 */
var workspace = {
	files : {}, 	// Will hold editor references, layers and history information
	current : 0,	// Current must always point to element in focus
	
	newFile : function(s){
		this.current = 0;
		var id = 'file'+this.current;
		$('<div class="file"><div class="topInfo"><div class="filename">File '+(this.current+1)+'</div><div class="fileops"><a href="#closeFile" rel="'+this.current+'"><i class="icon-minus-sign icon-large"></i></a></div></div><div class="box scrollbars"><canvas width="100%" height="100%" id="'+id+'" style="color:#09F"></canvas></div></div>').appendTo('#workspace').draggable({
			handle: '.topInfo'
		}).resizable();
		//
		$("a[href='#closeFile']").unbind('click').click(function(e){
			e.preventDefault();
			// Out of this scope, use workspace
			workspace.closeFile($(this).attr('rel'));
			// Close visually
			$(this).parents('.file').remove();
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
		this.files[this.current].editor.load(src, function(){
			wk.addHistory('New layer','#C30'); // Initial background layer
		});
	},
	
	closeFile : function(num){
		delete this.files.num;
	},
	
	editor : function(){
		return this.files[this.current].editor;
	},
	
	addLayer : function(name, color){
		this.files[this.current].layers.push(name);
		var span = '', eye='';
		var total = this.files[this.current].length;
		if(total > 1){
			eye = '<i class="icon-eye-open icon-large"></i> ';
			span = '<span><i class="icon-trash"></span>';
		}
		$('<li><a href="#layers" rel="'+(total-1)+'" style="border-left:'+color+' solid 3px">'+eye+name+span+'</a></li>').prependTo('#layers');
		$('#layers a span').unbind('click');
		$('#layers a span').click(function(e){
			e.preventDefault();
			e.stopPropagation();
			var index = $(this).parent().attr('rel');
			removeLayer(index);
		});
	},
	
	addHistory : function(name, color){
		this.files[this.current].history.push(name);
		var total = this.files[this.current].length;
		$('<li><a href="#layers" rel="'+(total-1)+'" style="border-left:'+color+' solid 3px" title="Go back">'+name+'</a></li>').prependTo('#history');
		$('#history a').click(function(e){
			e.preventDefault();
			e.stopPropagation();
			console.log('Going back in time');
		});
	},
	
	removeLayer : function(index){
		this.files[this.current].layers.splice(index,1);
		$("#layers a[rel='"+index+"']").parent('li').remove();
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
	}
};