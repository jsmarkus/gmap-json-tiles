module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': 'dist/<%= pkg.name %>.js'
                }
            }
        },
        concat: {
            options: {
                separator: '\n\n//--------\n\n'
            },
            dist: {
                src: [
                    'concat-intro.js',
                    'bower_components/geoJSON-to-Google-Maps/GeoJSON.js',
                    'src/Feature.js',
                    'src/JSONMapType.js',
                    'concat-outro.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['concat', 'uglify']);

};