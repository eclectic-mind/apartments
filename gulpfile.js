var { watch, src, dest, parallel, series } = require("gulp");

var browserSync = require("browser-sync");
var del = require("del");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var cssnano = require("cssnano");
var pug = require("gulp-pug");
var imagemin = require("gulp-imagemin");
var typograf = require("gulp-typograf");
var htmlbeautify = require("gulp-html-beautify");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var webpack = require("webpack");
var webpackStream = require("webpack-stream");

function devServer(cb) {
  var params = {
    watch: true,
    reloadDebounce: 150,
    notify: false,
    server: {
      baseDir: "./public",
    },
  };

  browserSync.create().init(params);
  cb();
}

function clearBuild() {
  return del("public/");
}

function buildPages() {
  var options = {
    indentSize: 2,
  };

  return src("src/pages/*.pug")
    .pipe(pug())
    .pipe(
      typograf({
        locale: ["ru", "en-US"],
      })
    )
    .pipe(htmlbeautify(options))
    .pipe(dest("public/"));
}

function buildStyles() {
  return src("src/styles/*.scss")
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest("public/styles/"));
}

function buildScripts() {
  return src("src/scripts/main.js")
    .pipe(
      webpackStream({
        output: {
          filename: "bundle.js",
        },
        module: {
          rules: [
            {
              test: /\.(js)$/,
              exclude: /(node_modules)/,
              loader: "babel-loader",
              //query: {
              //presets: ["env"],
              //},
            },
          ],
        },
        externals: {
          jquery: "jQuery",
        },
      })
    )
    .pipe(dest("public/scripts/"))
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(dest("public/scripts/"));

  //return src("src/scripts/**/*.js").pipe(dest("public/scripts/"));
}

function buildAssets(cb) {
  src("src/assets/fonts/*.*").pipe(
    dest("public/assets/fonts/")
  );
  src("src/assets/img/**/*.*")
    .pipe(imagemin())
    .pipe(dest("public/assets/img/"));
  cb();
}

function watchFiles() {
  watch(["src/pages/*.pug", "src/pages/**/*.pug"], buildPages);
  watch(["src/styles/*.scss", "src/styles/**/*.scss"], buildStyles);
  watch(["src/scripts/*.js", "src/scripts/**/*.js"], buildScripts);
  watch("src/assets/**/*.*", buildAssets);
}

function errorHandler(errors) {
  console.warn("Error!");
  console.warn(errors);
}

exports.default = series(
  clearBuild,
  parallel(
    devServer,
    series(
      parallel(buildPages, buildStyles, buildScripts, buildAssets),
      watchFiles
    )
  )
);
