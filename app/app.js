/**            
 *                         - nuophoto -
 *
 *  A JavaScript/HTML5 canvas image editor
 *
 *  @demo http://aurbano.github.com/nuophoto (Temporary location)
 *  @homepage https://github.com/aurbano/nuophoto
 *  @author Alejandro U. Alvarez (http://urbanoalvarez.es)
 *  @license MIT
 **/

'use strict';

define([
  'angular',
  'bootstrap-sass',
  'angular-bootstrap',
  'angular-route'
], function(angular, angularRoute) {
  // Declare app level module which depends on views, and components
  return angular.module('nuophoto', [
    'ngRoute'
  ]).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({});
  }]);
});