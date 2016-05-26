var gulp = require('gulp');

gulp.task('autoprefixer', function () {
    var postcss      = require('gulp-postcss');
    //var sourcemaps   = require('gulp-sourcemaps');
    var autoprefixer = require('autoprefixer');

    return gulp.src('./mobile/css/*.css')
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        .pipe(gulp.dest('./mobile/css/'));
});

gulp.task('default', ['autoprefixer'], function() {
  // 将你的默认的任务代码放在这

});