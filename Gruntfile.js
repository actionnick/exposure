module.exports = function(grunt) {
  require("load-grunt-tasks")(grunt);
  const find = require("find");

  const presets = ["react", "es2015", "es2016", "es2017"];

  const plugins = [
    "babel-plugin-transform-react-jsx-source",
    "babel-plugin-transform-object-rest-spread",
    "babel-plugin-transform-class-properties",
    "glslify",
  ];
  const transform = [["babelify", { presets, plugins }], "glslify"];

  const srcFiles = find.fileSync(/\.js$/, "src");
  const distFiles = srcFiles.map(fileName => {
    const fileParts = fileName.split("/");
    fileParts[0] = "dist";
    return fileParts.join("/");
  });

  const babelFiles = {};
  srcFiles.forEach((fileName, i) => (babelFiles[distFiles[i]] = fileName));

  grunt.initConfig({
    babel: {
      options: {
        plugins,
        presets,
      },
      dist: {
        files: babelFiles,
      },
    },
    uglify: {
      editor: {
        files: {
          "editor/build/exposure.min.js": ["editor/build/exposure.js"],
        },
      },
    },
    browserify: {
      editor_watch: {
        src: ["editor/main.js"],
        dest: "editor/build/exposure.js",
        options: {
          transform,
          watch: true,
          keepAlive: true,
        },
      },
      editor: {
        src: ["editor/main.js"],
        dest: "editor/build/exposure.js",
        options: {
          transform,
        },
      },
    },
    watch: {
      shaders: {
        files: ["src/shaders/**/*"],
        tasks: ["browserify:editor"],
      },
    },
    parallel: {
      editor: {
        options: {
          stream: true,
        },
        tasks: [
          {
            grunt: true,
            args: ["watch:shaders"],
          },
          {
            grunt: true,
            args: ["browserify:editor_watch"],
          },
        ],
      },
    },
  });

  grunt.registerTask("release", "build dist director", ["execute:build_dist"]);
  grunt.registerTask("editor_build", "prod build for editor", [
    "browserify:editor",
    "uglify:editor",
  ]);
  grunt.registerTask("editor_watch", "watch js and shaders", ["parallel:editor"]);
};
