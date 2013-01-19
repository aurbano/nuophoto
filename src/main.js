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
        jquery: '/nuophoto/lib/jquery.min'
    }
});

define(["jquery", "imgEditor", "workspace"], function($) {
    //the jquery.alpha.js and jquery.beta.js plugins have been loaded.
    $(function() {
        $(document).ready(function(e){
			var editor = new imgEditor('#bg');
			editor.load('img/editor/1.jpg', function(){
				workspace.addHistory('New photo','#C30'); // Initial background layer
				workspace.addLayer('<i class="picker" style="background:#efefef"></i> Background','#3FC230'); // Initial background layer
			});
			
			$('.gui a').click(function(e){
				e.preventDefault();
				// Intercept gallery calls
				if($(this).attr('href') == '#gallery') return displayGallery();
				if($(this).attr('href') == '#webPhoto') return displayWebPhoto();
				if($(this).attr('href') == '#download') return alert('Not ready yet!');
				// Copy color from tool
				var color = $(this).css('borderLeftColor'),
					effect = $(this).attr('href').substring(1);
				// Normal effect
				workspace.addHistory($(this).text(),color);
				workspace.addLayer($(this).text(),color);
				/*
				// Call function
				editor[$(this).attr('href').substring(1)]();
				*/
				editor.applyEffect(effect);
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
	});
});