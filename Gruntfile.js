/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    name: 'taxi',
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    header : ';(function () {',
    footer : 'taxi.version = "<%= pkg.version %>";\n})();',
    concat: {
      vendor: {
        src: [
          'vendor/jquery*.js',
          'vendor/underscore*.js',
          'vendor/backbone*.js'
        ],
        dest: 'dist/vendor.js'
      },
      'vendor-test-js': {
        src: [
          'vendor/mocha*.js',
          'vendor/chai*.js',
          'vendor/sinon*.js',
          'vendor/grunt-mocha-helper*.js'
        ],
        dest: 'dist/vendor-test.js'
      },
      'vendor-test-css': {
        src: [
          'vendor/mocha*.css'
        ],
        dest: 'dist/vendor-test.css'
      },
      test: {
        src: [
          'test/**/*.js'
        ],
        dest: 'dist/test.js'
      },
      src: {
        src: [
          'src/taxi.js',
          'src/DriverModel.js',
          'src/**/*.js'
        ],
        dest: 'dist/src.js'
      },
      dist: {
        src: [
          '<banner:meta.banner>',
          '<banner:header>',
          'dist/src.js',
          'dist/templates.js',
          '<banner:footer>'
        ],
        dest: 'dist/<%= name %>.js'
      },
      'dist-complete': {
        src: [
          'dist/vendor.js',
          '<config:concat.dist.dest>'
        ],
        dest: 'dist/<%= name %>-complete.js'
      }
    },
    watch: {
      // Separate task for livereload for CSS-no-refresh:
      livereload: {
        files: [
          'dist/**/*'
        ],
        options: {
          livereload: 35730
        }
      },
      css: {
        files: [
          'src/**/*.less'
        ],
        tasks: [
          'less:development'
        ]
      },
      scripts: {
        files: [
          'src/**/*.js',
          'src/**/*.html',
          'test/**/*',
          'index.html'
        ],
        tasks: [
          'build'
        ]
      }
    },
    jst: {
      compile: {
        options: {
          processName: function (name) {
            // strip src/templates/ and .html
            return name.split('/').slice(2).join('/').slice(0, -5);
          },
          templateSettings: {
            interpolate : /\{\{(.+?)\}\}/g
          },
          namespace: "<%= name %>.templates"
        },
        files: {
          "dist/templates.js": ["src/templates/**/*.html"]
        }
      }
    },
    less: {
      development: {
        options: {
          // Scan for imports:
          paths: []
        },
        files: {
          "dist/<%= name %>.css": "src/styles/**/*.less"
        }
      },
      production: {
        options: {
          // paths: ["assets/css"],
          yuicompress: true
        },
        files: {
          "dist/<%= name %>.css": "src/styles/**/*.less"
        }
      }
    },

    // Testing:
    mocha: {
      index: ['test/index.html']
    },

    // The server:
    connect: {
      server: {
        options: {
          port: 8999,
          base: '.',
          middleware : function (connect, options) {
            return [
              // Connect middleware to inject livereload script.
              require('connect-livereload')({
                port : 35730
              }),
              // Serve static files.
              connect.static(options.base),
              // Make empty directories browsable.
              connect.directory(options.base)
            ];
          }
        }
      }
    }
  });

  // Default task.
  grunt.registerTask('build', ['jst', 'less', 'concat']);
  grunt.registerTask('test', ['build', 'mocha']);
  grunt.registerTask('default', ['build', 'connect', 'watch']);

  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
};