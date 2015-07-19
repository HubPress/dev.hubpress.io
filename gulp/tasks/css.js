var gulp = require('gulp');
var path = require('path');
var config = require('../config').css;


var gulpLess = require("gulp-less"),
    LessPluginCleanCSS = require("less-plugin-clean-css"),
    LessPluginAutoPrefix = require('less-plugin-autoprefix');

var cleancss = new LessPluginCleanCSS({advanced: true}),
autoprefix= new LessPluginAutoPrefix({browsers: ["last 2 versions"]});

gulp.task('css', function() {
  return gulp.src(config.src)
    .pipe(gulpLess({
      paths: [ path.join(__dirname, 'less', 'includes') ],
      plugins: [autoprefix, cleancss]
    }))
    .pipe(gulp.dest(config.dest));
});
