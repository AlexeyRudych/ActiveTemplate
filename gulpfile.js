var gulp = require("gulp");
var server = require("gulp-server-livereload");
var sass = require("gulp-sass");
var prefix = require("gulp-autoprefixer");
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var ftp = require('vinyl-ftp');

gulp.task('start', function() {
  gulp.src('app')
    .pipe(server({
      livereload: true,
      open: true
    }));
});


gulp.task('styles', function () {
	gulp.src('app/sass/**/*.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(prefix({
            browsers: ['last 30 versions']
        }))
		.pipe(gulp.dest('app/css'));
});

gulp.task('build', function () {
    gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', csso()))
        .pipe(gulp.dest('astound'));
});

gulp.task('send', ['build'], function() {
    var conn = ftp.create( {
        host:     '77.120.110.166',
        user:     'alexlabs',
        password: 'Arj4h00F9x',
        parallel: 5
    } );

    /* list all files you wish to ftp in the glob variable */
    var globs = [
        'astound/**/*',
        '!node_modules/**' // if you wish to exclude directories, start the item with an !
    ];

    return gulp.src( globs, { base: '.', buffer: false } )
        .pipe( conn.newer( '/public_html/' ) ) // only upload newer files
        .pipe( conn.dest( '/public_html/' ) )

});


gulp.task('default', ['start'], function () {
  gulp.watch('app/sass/**/*.sass', ['styles']);
});