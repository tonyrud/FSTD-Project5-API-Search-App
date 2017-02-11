"use strict"

var gulp = require('gulp'),
    browserSync = require('browser-sync').create();

/*-------------------
  Reload Browser
---------------------*/
//run concat, then reload the page
gulp.task('reload', function(done){
  browserSync.reload();
  done();
});

/*-------------------
Browser sync watch files and server start
---------------------*/
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('*.html', ['reload'])
    gulp.watch('css/*.css', ['reload'])
    gulp.watch('js/*.js', ['reload'])
});


gulp.task('default',  function (){
  gulp.start('browser-sync');
});
