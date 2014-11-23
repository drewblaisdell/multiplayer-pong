module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      client: {
        src: 'core/*',
        dest: 'public/scripts/'
      },
      server: {
        src: 'core/*',
        dest: 'app/'
      }
    },

    watch: {
      scripts: {
        files: ['core/*.js'],
        tasks: ['copy']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['copy']);
  grunt.registerTask('development', ['copy']);
};