const gulp = require('gulp');
const Pug = require('gulp-pug');
const cleanCSS = require('gulp-clean-css'); //壓縮css
const Sass = require('gulp-sass'); //編譯sass/scss檔案
const Concat = require('gulp-concat'); //合併
const Rename = require('gulp-rename'); //重新更名 
const Uglify = require('gulp-uglify'); // 壓縮js
const Babel = require('gulp-babel'); // 壓縮js
const Plumber = require('gulp-plumber'); //處理錯誤訊息
const Postcss = require('gulp-postcss'); //前處理css
const autoprefixer = require('autoprefixer');
const imageMin = require('gulp-imagemin'); //壓縮圖片

/*   HTML   */
gulp.task('Pug', () => {
  return gulp.src(['src/pug/*.pug'])
    // .pipe(Plumber())
    .pipe(Pug({
      pretty: true
    }))
    .pipe(Rename(function (path) {
      path.extname = ".php";
    }))
    .pipe(gulp.dest('./'))
});

/*   CSS   */
gulp.task('Sass', function () {
  var processors = [
    autoprefixer({
      browsers: ['last 5 version'],
    })
  ];

  return gulp.src(['src/scss/*.scss'])
    .pipe(Plumber())
    .pipe(Sass({
        outputStyle: 'nested'
      })
      .on('error', Sass.logError))
    .pipe(Postcss(processors))
    .pipe(gulp.dest('src/css'))
});

gulp.task('CSSConcat', ['Sass'], function () {
  return gulp.src('src/css/*.css')
    .pipe(Concat('all.css'))
    .pipe(gulp.dest('src/dist/css'))
});

gulp.task('cleanCSS', ['CSSConcat'], function () {
  return gulp.src('src/dist/css/all.css')
    .pipe(Rename(function (path) {
      path.basename += ".min"
      path.extname = ".css"
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('src/dist/css'))
});

/*   JS   */
gulp.task('JSConcat', function () {
  return gulp.src('src/js/*.js')
    .pipe(Plumber())
    .pipe(Concat('all.js'))
    .pipe(Babel({
      presets: [
        ['env', {
          modules: false
        }]
      ]
    }))
    .pipe(gulp.dest('src/dist/js'))
});

gulp.task('minifyJS', ['JSConcat'], function () {
  return gulp.src('src/js/all.js')
    .pipe(Plumber())
    .pipe(Uglify(({
      compress: {
        drop_console: true
      }
    })))
    .pipe(Rename(function (path) {
      path.basename += ".min";
      path.extname = ".js";
    }))
    .pipe(gulp.dest('src/dist/js'))
});

/*   OTHERS   */
gulp.task('imageMin', function () {
  gulp.src('source/image/*')
    .pipe(imageMin())
    .pipe(gulp.dest('src/images'));
});

/*   CMD指令   */
gulp.task('watch', function () {
  gulp.watch(['src/pug/*.pug'], ['Pug']);
  gulp.watch(['src/scss/*.scss'], ['cleanCSS']);
  gulp.watch('src/js/*.js', ['minifyJS']);
});

gulp.task('build', ['Pug', 'cleanCSS', 'minifyJS', 'imageMin']);

gulp.task('default', ['Pug', 'cleanCSS', 'minifyJS']);
