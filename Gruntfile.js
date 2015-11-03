// musicJunkie Gruntfile

module.exports = function(grunt) {
  grunt.initConfig({
    clean: {
      build: ['www/!(res)/*', '.tmp/**/*']
    },
    jshint: {
      options: {
        globals: {
          jQuery: true
        },
        ignores: ['*.min.*']
      },
      all: ['app/js/**/*.js', '!app/js/**/*.min.js', './*.js']
    },
    copy: {
      build: {
        files: [{
          expand: true,
          cwd: 'app/',
          src: ['**'],
          dest: 'www/'
        }]
      },
      no_cats: {
        files: [{
          expand: true,
          cwd: 'app/',
          src: ['**', '!**/*.js']
        }]
      },
      concat: {
        files: [{
          expand: true,
          cwd: ".tmp/concat/",
          src: ["**/*"],
          dest: 'www/'
        }]
      }
    },
    useminPrepare: {
      html: "app/index.html",
      options: {
        dest: 'www/'
      }
    },
    usemin: {
      html: "www/index.html",
      options: {
        assetsDirs: ['www', 'www/js', 'www/css', 'app/js', 'app/css']
      }
    },
    filerev: {
      options: {
        encoding: "utf8",
        algorithm: "md5",
        length: "20"
      },
      source: {
        files: [{
          src: ['www/js/*.js', 'www/css/*.css']
        }]
      }
    }
  });
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-filerev');

  grunt.registerTask('build', [
    "jshint:all",
    "clean:build",
    "copy:build"
  ]);
  grunt.registerTask('testBuild', [
    "jshint:all",
    "clean:build",
    "copy:build",
    "useminPrepare",
    "concat",
    "copy:concat",
    "filerev",
    "usemin"
  ]);
};
