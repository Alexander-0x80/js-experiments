"use strict";

module.exports = function(grunt) {
    grunt.initConfig({
        app: {
            gruntfile: "Gruntfile.js",
            markup: "*/*.html",
            scripts: "*/*.js",
            styles: "*/*.css",
        },

        connect: {
            server: {
                options: {
                    port: 8080,
                    base: ".",
                    hostname: "0.0.0.0",
                    middleware: function(connect, options) {
                         return [
                            require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
                            connect.static(options.base[0])
                        ];
                    }
                }
            }
        },

        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: false,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                node: true,
                laxbreak: true,
                globals: {
                    "window": false,
                    "document": false
                }
            },

            gruntfile: ["<%= app.gruntfile %>"],
            scripts: ["<%= app.scripts %>"]
        },

        watch: {
            gruntfile: {
                files: ["<%= app.gruntfile %>"],
                tasks: ["jshint:gruntfile"]
            },
            scripts: {
                files: ["<%= app.scripts %>"],
                tasks: ["jshint:scripts"],
                options: { livereload: true }
            },
            markup: {
                files: ["<%= app.markup %>", "<%= app.styles %>"],
                options: { livereload: true }
            }
        }
    });
    
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-livereload");

    grunt.registerTask("default", ["jshint", "connect", "watch"]);
};