/*	          
 *	                       - nuophoto -
 *
 *	A JavaScript/HTML5 canvas image editor
 *
 *	Test it: http://lab.nuostudio.com/editor.html (Temporary location)
 *	Project page: https://github.com/aurbano/nuophoto
 *	Author: Alejandro U. Alvarez (http://urbanoalvarez.es)
 *
 *	Description:
 *		A nice editor built using imgEditor
 *		at the moment they are the same project
 *		although as things move on I will probably separate them
 *		and create two independent projects. imgEditor will become
 *		a JS img library with editing functions and such, hopefully with
 *		dependance on the canvas element. And nuophoto will become a nice
 *		gui to interact with it and test it out.
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
        jquery: '/nuophoto/lib/jquery.min',
		colorpicker: '/nuophoto/lib/colorpicker/js/colorpicker'
    }
});

define(["jquery", "imgEditor", "workspace", "colorpicker"], function($) {
    $(function() {
		$(document).ready(function(e){
			// Resize editor
			workspace.resizeEditor();
			
			// Create a new empty file
			workspace.newFile();
			
			
			$('.gui a').click(function(e){
				e.preventDefault();
				// Close menu
				workspace.closeMenus();
				// Intercept gallery calls
				if($(this).attr('href') == '#gallery') return workspace.displayGallery();
				if($(this).attr('href') == '#webPhoto') return workspace.displayWebPhoto();
				if($(this).attr('href') == '#download') return alert('Not ready yet!');
				// Copy color from tool
				var color = $(this).css('borderLeftColor'),
					effect = $(this).attr('href').substring(1);
				// Normal effect
				workspace.addHistory($(this).text(),color);
				workspace.addLayer($(this).text(),color);
				
				workspace.editor().applyEffect(effect);
			});
			
			$('.gui h3').click(function(e){
				e.preventDefault();
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
			
			$('canvas, #config').click(function(e){
				e.preventDefault();
				workspace.closeMenus();
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
				workspace.loadFile('img/editor/'+$(this).attr('rel'));
				$('#gallery').fadeOut(300);
				$('#webPhoto').fadeOut(300);
				$('#overlay').fadeOut(300);
			});
			
			// Updaters
			//$(window).resize(function(e){editor.resizeCanvas(); });
		});
	});
});