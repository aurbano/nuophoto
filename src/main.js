/*	          
 *	                       - nuophoto -
 *
 *	A JavaScript/HTML5 canvas image editor
 *
 *	Test it: http://aurbano.github.com/nuophoto (Temporary location)
 *	Project page: https://github.com/aurbano/nuophoto
 *	Author: Alejandro U. Alvarez (http://urbanoalvarez.es)
 *
 *	Description:
 *		A nice editor built with JavaScript.
 *
 *	Requirements:
 *		- jQuery
 *		- requireJS
 *		- imgEditor
 *		- workspace (Just some gui functions)
 */
requirejs.config({
    enforceDefine: false,
    paths: {
		// Including CDN version and local fallback in case that fails
        jquery: ['http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min',
				'/nuophoto/lib/jquery.min'],
		jqueryui : ['http://ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui.min',
					'/nuophoto/lib/jqueryui.min'],
		colorpicker: '/nuophoto/lib/colorpicker/js/colorpicker'
    },
	shim: {
        'colorpicker': ['jquery'],
        'jqueryui': ['jquery']
    }
});

requirejs.onError = function (err) {
	switch(err.requireType){
		case 'timeout':
			alert('Something is taking too long to load! Make sure your Internet connection is fine');
			break;
		case 'scripterror':
			alert("I can't find a script, please check if all dependencies have been loaded");
			break;
		default:
			alert("An error occurred. For more information check the console");
			console.log('[nuophoto] An error occured:');
			console.log(err);
			break;
	}
};

define(["jquery", "workspace"], function($, workspace) {
    $(function() {
		$(document).ready(function(e){
			// Resize editor
			workspace.resizeEditor();
			
			// Create a new empty file
			workspace.newFile();
			// Preload an image (makes development faster)
			workspace.loadFile('img/editor/4.jpg');
			
			
			$('.gui a').click(function(e){
				e.preventDefault();
				// Close menu
				workspace.closeMenus();
				// Intercept gallery calls
				if($(this).attr('href') == '#newFile') return workspace.newFile();
				if($(this).attr('href') == '#gallery') return workspace.displayGallery();
				if($(this).attr('href') == '#webPhoto') return workspace.displayWebPhoto();
				if($(this).attr('href') == '#download') return workspace.saveImage();
				// Copy color from tool
				var color = $(this).css('borderLeftColor'),
					effect = $(this).attr('href').substring(1);
				// Normal effect
				workspace.addHistory($(this).text(),color);
				workspace.addLayer($(this).text(),color);
				
				workspace.setStatus('Working...');
				workspace.editor().applyEffect(effect, function(){
					workspace.clearStatus();
				});
			});
			
			$('.gui h3').click(function(e){
				e.preventDefault();
				e.stopPropagation();
				if($(this).children('i').first().attr('class') == 'icon-caret-right'){
					// Collapsed
					workspace.closeMenus();
					$(this).next('ul').slideDown(100);
					$(this).children('i').first().removeClass('icon-caret-right').addClass('icon-caret-down');
					return true;	
				}
				$(this).next('ul').slideUp(100);
				$(this).children('i').first().removeClass('icon-caret-down').addClass('icon-caret-right');
			});
			
			$(document).click(function(e){
				workspace.closeMenus();
			});
			
			$('#overlay').click(function(e){
				e.preventDefault();
				$('#gallery').fadeOut(300);
				$('#webPhoto').fadeOut(300);
				$('#error').fadeOut(300);
				$('#overlay').fadeOut(300);
			});
			
			$('#photoList a').click(function(e){
				e.preventDefault();
				// Now load the new pic
				workspace.loadFile('img/editor/'+$(this).attr('rel'));
				$('#gallery').fadeOut(300);
				$('#webPhoto').fadeOut(300);
				$('#overlay').fadeOut(300);
			});
			
			$(document).on('click',"a[href='#closeFile']",function(e){
				e.preventDefault();
				// Out of this scope, use workspace
				workspace.closeFile($(this).attr('rel'));
				// Close visually
				$(this).parents('.file').remove();
			});
			
			$(document).on('click','#history a',function(e){
				e.preventDefault();
				e.stopPropagation();
				console.log('Going back in time');
			});
			
			$(document).on('click','#layers a span',function(e){
				e.preventDefault();
				e.stopPropagation();
				var index = $(this).parent().attr('rel');
				workspace.removeLayer(index);
			});
			
			$(document).on('click','#tools a',function(e){
				e.preventDefault();
				e.stopPropagation();
				
				switch($(this).attr('href')){
					case '#zoomOut':
						workspace.zoom(0.75);
						break;
					case '#zoomIn':
						workspace.zoom(1.25);
						break;
				}
			});
			
			$('#tools').draggable({
				handle: '.topInfo',
				stack: ".file"
			});
			
			// Updaters
			$(window).resize(function(e){workspace.resizeEditor(); });
		});
	});
});