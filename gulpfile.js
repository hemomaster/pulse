const { src, dest, watch, parallel, series } = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");

// BROWSER-SYNC
const server = () => {
  browserSync.init({
    server: {
      baseDir: "src",
    },
  });
};

// CREATE CSS
const styles = () => {
  return src("src/scss/**/*.+(scss|sass)")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(
      cleanCSS({ compatibility: "*", level: { 1: { specialComments: 0 } } })
    )
    .pipe(
      rename({
        prefix: "",
        suffix: ".min",
      })
    )
    .pipe(dest("src/css"))
    .pipe(browserSync.stream());
};

// WATCHING
const watching = () => {
  watch("src/scss/**/*.+(scss|sass)", styles);
  watch("src/*.html").on("change", browserSync.reload);
};

exports.server = server;
exports.styles = styles;
exports.watching = watching;

exports.default = parallel(styles, watching, server);
