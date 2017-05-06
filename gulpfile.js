var gulp = require('gulp');
var gulp_nodemon = require('gulp-nodemon');
var browser_sync = require('browser-sync').create();

// serve
gulp.task('browser_serve', function() {
	browser_sync.init({
		server: {
			baseDir: 'frontend'
		},
	})
});

// auto refresh browser on change
gulp.task('browser_sync', function(){
  browser_sync.reload();
});

// watcher for the source files
gulp.task('watch', ['browser_serve','browser_sync'], function (){
	gulp.watch('frontend/**/*.html', ['browser_sync']); 
	gulp.watch('frontend/**/*.css', ['browser_sync']); 
	gulp.watch('frontend/**/*.js', ['browser_sync']); 
});