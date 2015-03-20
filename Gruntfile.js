module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    express: {
      web: {
        options: {
          script: 'js/backend/app.js',
        }
      },
    },
    browserify: {
      example_watch: {
        src: ['js/frontend/example/main.js'],
        dest: 'js/builds/example.js',
        options: {
          transform: ['glslify'],
          watch: true,
          keepAlive: true
        }
      },
      example: {
        src: ['js/frontend/example/main.js'],
        dest: 'js/builds/example.js',
        options: {
          transform: ['glslify']
        }
      }
    },

    watch: {
      frontend: {
        options: {
          livereload: true
        },
        files: [
          'views/**/*.html',
          'js/builds/*.js'
        ]
      },
      example: {
        files: [
          'js/frontend/example/**/*.js'
        ],
        tasks: [
          'browserify:example'
        ]
      },
      shaders: {
        files: [
          'shaders/**/*'
        ],
        tasks: [
          'browserify:example'
        ]
      },
      web: {
        files: [
          'js/backend/**/*.js'
        ],
        tasks: [
          'express:web'
        ],
        options: {
          nospawn: true, //Without this option specified express won't be reloaded
          atBegin: true,
        }
      }
    },
    parallel: {
      web: {
        options: {
          stream: true
        },
        tasks: [
          {
            grunt: true,
            args: ['watch:frontend']
          },
          {
            grunt: true,
            args: ['watch:shaders']
          },
          {
            grunt: true,
            args: ['browserify:example_watch']
          },
          {
            grunt: true,
            args: ['watch:web']
          }
        ]
      },
    }
  });
  grunt.registerTask('web', 'launch webserver and watch tasks', [
    'parallel:web',
  ]);

  grunt.registerTask('default', ['web']);
};
