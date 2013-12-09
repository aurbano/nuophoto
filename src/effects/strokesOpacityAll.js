/**
 * Paint the canvas with strokes in all directions 
 * @param {Object} main
 */
var parameters = [];
var exec = function(main){
	main.applyEffect('strokesOpacityLeft');
	main.applyEffect('strokesOpacityRight');
	main.applyEffect('strokesOpacityVertical');
	main.applyEffect('strokesOpacityHorizontal');
};