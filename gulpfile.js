const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mediaquery = require('postcss-combine-media-query');
const cssnano = require('cssnano');
const htmlMinify = require('html-minifier');

const build = gulp.series(clean, gulp.parallel(html, images, styles, fonts));
const watchapp = gulp.parallel(build, watchFiles, serve);

function html() {
    const options = {
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      sortClassName: true,
      useShortDoctype: true,
      collapseWhitespace: true,
        minifyCSS: true,
        keepClosingSlash: true
    };
  return gulp.src('src/**/*.html')
        .pipe(plumber())
                .on('data', function(file) {
              const buferFile = Buffer.from(htmlMinify.minify(file.contents.toString(), options))
              return file.contents = buferFile
            })
                .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
}


function css() {
 const plugins = [
     autoprefixer(),
        mediaquery(),
     cssnano()
 ];
  return gulp.src('src/styles/**/*.css')
        .pipe(plumber())
        .pipe(concat('bundle.css'))
 .pipe(postcss(plugins))
        .pipe(gulp.dest('dist/'))
  .pipe(browserSync.reload({stream: true}));
}


function images() {
  return gulp.src('src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}')
            .pipe(gulp.dest('dist/images'))
 .pipe(browserSync.reload({stream: true}));
}

function fonts() {
  return gulp.src('src/fonts/**/*.{woff, woff2, css}')
            .pipe(gulp.dest('dist/fonts'))
 .pipe(browserSync.reload({stream: true}));
}

function styles() {
  return gulp.src('src/styles/**/*.css')
            .pipe(gulp.dest('dist/styles'))
 .pipe(browserSync.reload({stream: true}));
}


function clean() {
  return del('dist');
}

function watchFiles() {
  gulp.watch(['src/**/*.html'], html);
//  gulp.watch(['src/blocks/**/*.css'], css);
  gulp.watch(['src/images/*.{jpg,png,svg,gif,ico,webp,avif}'], images);
  gulp.watch(['src/fonts/*.{woff, woff2}'], fonts);
  gulp.watch(['src/styles/*.css'], styles);
}

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
}


exports.html = html; //все HTML-файлы из папки src/ должны оказаться в папке dist/
exports.css = css; //заставить Gulp пробежаться по всем этим файлам, склеить их в один файл bundle.css и отправить в папку dist/
exports.images = images; //Все эти файлы мы просто перенесём в соответствующие им папки внутри dist/
exports.fonts = fonts; //Все эти файлы мы просто перенесём в соответствующие им папки внутри dist/
exports.styles = styles; //Все эти файлы мы просто перенесём в соответствующие им папки внутри dist/
exports.clean = clean; //Перед каждой сборкой полезно удалить все файлы из папки dist/ и загрузить туда новые результаты
exports.build = build;
exports.watchapp = watchapp;
exports.default = watchapp;
