/*	- Workspace -
 *	Layer to interact with the workspace, opening and closing menus
 *  history functions, layers...
 *
 *	It should only take care of gui interaction, all other behavior
 *	will be done in main.js
 */
var workspace = {
	layers : new Array(),
	history : new Array(),
	
	addLayer : function(name, color){
		this.layers.push(name);
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
	},
	
	addHistory : function(name, color){
		this.history.push(name);
		$('<li><a href="#layers" rel="'+(history.length-1)+'" style="border-left:'+color+' solid 3px" title="Go back">'+name+'</a></li>').prependTo('#history');
		$('#history a').click(function(e){
			e.preventDefault();
			e.stopPropagation();
			console.log('Going back in time');
		});
	},
	
	removeLayer : function(index){
		this.layers.splice(index,1);
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
	}
};