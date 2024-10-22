module.exports = function (grunt) {
  var banner = "/*! Version: <%= pkg.version %>\nCopyright (c) 2016 Dominik Moritz */\n";

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    uglify: {
      options: {
        banner: banner,
        preserveComments: false,
        sourceMap: true
      },
      build: {
        src: "dist/L.Control.Locate.umd.js",
        dest: "dist/L.Control.Locate.min.js"
      }
    },
    sass: {
      options: {
        implementation: require("sass"),
        sourceMap: false
      },
      dist: {
        options: {
          style: "compressed"
        },
        files: {
          "dist/L.Control.Locate.min.css": "src/L.Control.Locate.scss",
          "dist/L.Control.Locate.mapbox.min.css": "src/L.Control.Locate.mapbox.scss"
        }
      },
      uncompressed: {
        options: {
          style: "expanded"
        },
        files: {
          "dist/L.Control.Locate.css": "src/L.Control.Locate.scss",
          "dist/L.Control.Locate.mapbox.css": "src/L.Control.Locate.mapbox.scss"
        }
      }
    },
    rollup: {
      options: {
        plugins: [
          require("@rollup/plugin-node-resolve").nodeResolve(),
          require("@rollup/plugin-commonjs")()
        ]
      },
      build_es: {
        options: {
          format: "es",
          external: ["leaflet"]
        },
        files: {
          "dist/L.Control.Locate.esm.js": "src/L.Control.Locate.js"
        }
      },
      build_umd: {
        options: {
          format: "umd",
          name: "L.Control.Locate",
          external: ["leaflet"],
          globals: {
            leaflet: "L"
          },
          footer: `
            (function() {
              if (typeof window !== 'undefined' && window.L) {
                window.L.control = window.L.control || {};
                window.L.control.locate = window.L.Control.Locate.locate;
              }
            })();
          `
        },
        files: {
          "dist/L.Control.Locate.umd.js": "src/L.Control.Locate.js"
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-rollup");

  // Default task(s).
  grunt.registerTask("default", ["rollup:build_es", "rollup:build_umd", "uglify", "sass"]);
};
