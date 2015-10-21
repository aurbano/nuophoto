module.exports = function(grunt) {

  "use strict";

  grunt.loadNpmTasks("grunt-bower-requirejs");
  grunt.loadNpmTasks("grunt-contrib-requirejs");
  grunt.loadNpmTasks("grunt-string-replace");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-gh-pages");

  grunt.initConfig({
    bowerRequirejs: {
      target: {
        rjsConfig: "./app/config.js"
      }
    },
    clean: {
      build: {
        src: ["build"]
      }
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: "app",
          mainConfigFile: "app/config.js",
          include: "app",
          name: "../bower_components/almond/almond",
          out: "build/optimized.js",
          done: function(done, output) {
            var duplicates = require("rjs-build-analysis").duplicates(output);

            if (Object.keys(duplicates).length > 0) {
              grunt.log.subhead("Duplicates found in requirejs build:");
              for (var key in duplicates) {
                grunt.log.error(duplicates[key] + ": " + key);
              }
              return done(new Error("r.js built duplicate modules, please check the excludes option."));
            } else {
              grunt.log.success("No duplicates found!");
            }

            done();
          }
        }
      }
    },
    "string-replace": {
      dist: {
        src: "./index.html",
        dest: "./build/",
        options: {
          replacements: [{
            pattern: "bower_components/requirejs/require.js",
            replacement: "optimized.js"
          }]
        }
      }
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {
            expand: true,
            src: [
              "bower_components/bootstrap/dist/css/*",
              "bower_components/bootstrap/dist/fonts/*",
              "assets/**",
            ],
            dest: "build/"
          }
        ],
      },
    },
    "gh-pages": {
      options: {
        base: "build"
      },
      src: ["**"]
    }
  });

  grunt.registerTask("default", ["bowerRequirejs"]);

  grunt.registerTask("build", [
    "clean",
    "requirejs",
    "string-replace",
    "copy"
  ]);

  grunt.registerTask("deploy", [
    "clean",
    "requirejs",
    "string-replace",
    "copy",
    "gh-pages"
  ]);

};