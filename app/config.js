/*            
 *                         - nuophoto -
 *
 *  A JavaScript/HTML5 canvas image editor
 *
 *  Test it: http://aurbano.github.com/nuophoto (Temporary location)
 *  Project page: https://github.com/aurbano/nuophoto
 *  Author: Alejandro U. Alvarez (http://urbanoalvarez.es)
 *
 *  Description:
 *    A nice editor built with JavaScript.
 *
 *  Requirements:
 *    - jQuery
 *    - jQueryUI
 *    - requireJS
 *    - imgEditor
 *    - workspace (Just some gui functions)
 */
requirejs.config({
  enforceDefine: false,
  paths: {
    almond: "../bower_components/almond/almond",
    angular: "../bower_components/angular/angular",
    "angular-bootstrap": "../bower_components/angular-bootstrap/ui-bootstrap-tpls",
    "angular-loader": "../bower_components/angular-loader/angular-loader",
    "angular-route": "../bower_components/angular-route/angular-route",
    bootstrap: "../bower_components/bootstrap/dist/js/bootstrap",
    jquery: "../bower_components/jquery/dist/jquery",
    requirejs: "../bower_components/requirejs/require"
  },
  shim: {
    bootstrap: {
      deps: ["jquery"]
    },
    "angular-bootstrap": {
      deps: ["angular"]
    },
    "angular-loader": {
      deps: ["angular"]
    },
    "angular-route": {
      deps: ["angular"]
    }
  },
  packages: [

  ]
});
