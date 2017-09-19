module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  const presets = [
    'react',
    'es2015',
    'es2016',
    'es2017'
  ];

  const plugins = [
    'babel-plugin-transform-react-jsx-source',
    'babel-plugin-transform-object-rest-spread',
    'babel-plugin-transform-class-properties'
  ];
  const transform = [['babelify', { presets, plugins }], 'glslify'];

  grunt.initConfig({
    uglify: {
      demo: {
        files: {
          'demo/build.js': ['demo/build.js']
        }
      }
    },
    browserify: {
      demo_watch: {
        src: ['demo/main.js'],
        dest: 'demo/build.js',
        options: {
          transform,
          watch: true,
          keepAlive: true
        }
      },
      demo: {
        src: ['demo/main.js'],
        dest: 'demo/build.js',
        options: {
          transform
        }
      }
    },
    watch: {
      shaders: {
        files: [
          'src/shaders/**/*'
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

  grunt.registerTask('demo_build', 'prod build for demo', ["browserify:demo", "uglify:demo"]);
  grunt.registerTask('demo_watch', 'watch js and shaders', [
    'parallel:demo',
  ]);
};
