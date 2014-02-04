
var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var wrap = require('gulp-wrap');

var paths = {
	vimeowrap: 'src/*.js',
	carousel: 'src/plugins/carousel/*.js',
	infobox: 'src/plugins/infobox/*.js',
	lightsout: 'src/plugins/lightsout/*.js',
	playlist: 'src/plugins/playlist/*.js'
};

var wrapTemplate =
	'(function(window, document) {' +
		'<%= contents %>' +
	'})(window, document);';

gulp.task('vimeowrap', function() {
	gulp.src(paths.vimeowrap)
		.pipe(concat('vimeowrap.js'))
		.pipe(wrap(wrapTemplate))
		.pipe(uglify())
		.pipe(gulp.dest(''));
});

gulp.task('watch', function() {
	gulp.watch(paths.vimeowrap, ['vimeowrap']);
});

gulp.task('default', ['vimeowrap']);
