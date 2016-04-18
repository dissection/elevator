var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('js', function() {
    return gulp.src("./jQuery.dropdown.js")
        .pipe(rename({basename: "dropdown",suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('src'));
});
