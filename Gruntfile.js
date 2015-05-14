module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    browserify: {
      demo_watch: {
        src: ['demo/main.js'],
        dest: 'demo/build.js',
        options: {
          transform: ['glslify'],
          watch: true,
          keepAlive: true
        }
      },
      demo: {
        src: ['demo/main.js'],
        dest: 'demo/build.js',
        options: {
          transform: ['glslify']
        }
      }
    },
    watch: {
      shaders: {
        files: [
          'shaders/**/*'
        ],
        tasks: [
          'browserify:demo'
        ]
      }
    },
    parallel: {
      demo: {
        options: {
          stream: true
        },
        tasks: [
          {
            grunt: true,
            args: ['watch:shaders']
          },
          {
            grunt: true,
            args: ['browserify:demo_watch']
          }
        ]
      },
    }
  });
  grunt.registerTask('demo_watch', 'launch webserver and watch tasks', [
    'parallel:demo',
  ]);
};
