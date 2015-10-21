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

requirejs.config({
  enforceDefine: false,
  paths: {
    almond: "../bower_components/almond/almond",
    angular: "../bower_components/angular/angular",
    "angular-bootstrap": "../bower_components/angular-bootstrap/ui-bootstrap-tpls",
    "angular-loader": "../bower_components/angular-loader/angular-loader",
    "angular-route": "../bower_components/angular-route/angular-route",
    jquery: "../bower_components/jquery/dist/jquery",
    requirejs: "../bower_components/requirejs/require",
    "mjolnic-bootstrap-colorpicker": "../bower_components/mjolnic-bootstrap-colorpicker/dist/js/bootstrap-colorpicker",
    "jquery-ui": "../bower_components/jquery-ui/jquery-ui",
    "bootstrap-sass": "../bower_components/bootstrap-sass/assets/javascripts/bootstrap"
  },
  shim: {
    angular: {
      exports: "angular"
    },
    "bootstrap-sass": {
      deps: [
        "jquery"
      ]
    },
    "angular-bootstrap": {
      deps: [
        "angular"
      ]
    },
    "angular-loader": {
      deps: [
        "angular"
      ]
    },
    "angular-route": {
      deps: [
        "angular"
      ]
    }
  },
  packages: [

  ]
});

require([
  "angular",
  "app"
], function(angular, app) {

  "use strict";

  console.info("Nuophoto initialized");

  var $html = angular.element(document.getElementsByTagName("html")[0]);

  angular.element().ready(function() {
    // bootstrap the app manually
    angular.bootstrap(document, ["nuophoto"]);
  });

});

requirejs.onError = function(err) {
  switch (err.requireType) {
    case 'timeout':
      alert('Something is taking too long to load! Make sure your Internet connection is fine');
      break;
    case 'scripterror':
      alert("I can't find a script, please check if all dependencies have been loaded");
      break;
    default:
      alert("An error occurred. For more information check the console");
      console.error('[nuophoto] An error occured:');
      console.error(err);
      break;
  }
};