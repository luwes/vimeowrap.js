
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

gulp.task('carousel', function() {
	gulp.src(paths.carousel)
		.pipe(concat('vimeowrap.carousel.js'))
		.pipe(wrap(wrapTemplate))
		.pipe(uglify())
		.pipe(gulp.dest(''));
});

gulp.task('infobox', function() {
	gulp.src(paths.infobox)
		.pipe(concat('vimeowrap.infobox.js'))
		.pipe(wrap(wrapTemplate))
		.pipe(uglify())
		.pipe(gulp.dest(''));
});

gulp.task('lightsout', function() {
	gulp.src(paths.lightsout)
		.pipe(concat('vimeowrap.lightsout.js'))
		.pipe(wrap(wrapTemplate))
		.pipe(uglify())
		.pipe(gulp.dest(''));
});

gulp.task('playlist', function() {
	gulp.src(paths.playlist)
		.pipe(concat('vimeowrap.playlist.js'))
		.pipe(wrap(wrapTemplate))
		.pipe(uglify())
		.pipe(gulp.dest(''));
});

gulp.task('watch', function() {
	gulp.watch(paths.vimeowrap, ['vimeowrap']);
	gulp.watch(paths.carousel, ['carousel']);
	gulp.watch(paths.infobox, ['infobox']);
	gulp.watch(paths.lightsout, ['lightsout']);
	gulp.watch(paths.playlist, ['playlist']);
});

gulp.task('default', ['vimeowrap', 'carousel', 'infobox', 'lightsout', 'playlist']);
