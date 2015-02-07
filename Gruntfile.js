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
      watchify: {
        example: {
          src: './js/frontend/example/main.js',
          dest: 'js/builds/example.js'
        }
      },
      browserify: {
        example : {
          src: ['js/frontend/example/main.js'],
          dest: 'js/builds/example.js'
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
          tasks: [{
            grunt: true,
            args: ['watch:frontend']
          }, {
            grunt: true,
            args: ['watchify:example:keepalive']
          }, {
            grunt: true,
            args: ['watch:web']
          }]
        },
      }
    });
    grunt.registerTask('web', 'launch webserver and watch tasks', [
      'parallel:web',
    ]);
    
    grunt.registerTask('default', ['web']);
};
