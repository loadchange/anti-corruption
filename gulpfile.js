const { src, dest, watch, series } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');

sass.compiler = require('node-sass');

const THEME_NAME = 'baiyutang';
const THEME_DIR = `./src/${ THEME_NAME }`;
const DIST_DIR = `./wp/wp-content/themes/${ THEME_NAME }`

const php = (cb) => src(`${ THEME_DIR }/**/*.php`).pipe(dest(DIST_DIR));

const copyJS = (cb) => src(`${ THEME_DIR }/js/*.js`).pipe(dest(DIST_DIR + '/js'));

const js = (cb) => {
  return src(`${ THEME_DIR }/script/**/*.js`)
    .pipe(babel({
      presets: [ '@babel/env' ],
      plugins: [ '@babel/transform-runtime' ]
    }))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest(DIST_DIR + '/script'))
};

const scss = (cb) => src(`${ THEME_DIR }/**/*.scss`)
  .pipe(sass().on('error', sass.logError))
  .pipe(rename({ extname: '.css' }))
  .pipe(dest(DIST_DIR));

const TASKS = {
  php,
  js,
  scss
}

Object.keys(TASKS).map(k => {
  if (Array.isArray(TASKS[k])) {
    TASKS[k].map(item => watch(`${ THEME_DIR }/**/*.${ k }`, { events: 'all' }, item))
    return
  }
  watch(`${ THEME_DIR }/**/*.${ k }`, { events: 'all' }, TASKS[k])
});
watch(`${ THEME_DIR }/js/*.js`, { events: 'all' }, copyJS);

exports.default = series(php, copyJS, scss, js);