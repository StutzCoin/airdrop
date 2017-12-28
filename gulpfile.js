var gulp = require('gulp');
var pug = require('gulp-pug');

gulp.task('templates', function() {
    return gulp.src('templates/*.pug')
        .pipe(pug({
            client: false,
            compileDebug: false,
            retty: true
        }))
        .pipe(gulp.dest('build')); // tell gulp our output folder
});
