const { src, dest, watch, parallel, series } = require("gulp");

const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify-es").default;
const concat = require("gulp-concat");

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
    .pipe(sourcemaps.init())
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
    .pipe(sourcemaps.write("./"))
    .pipe(dest("src/css"))
    .pipe(browserSync.stream());
};

// JAVASCRIPT
const scripts = () => {
  return src([
    "node_modules/just-validate/dist/js/just-validate.js",
    "node_modules/inputmask/dist/inputmask.js",
    "node_modules/swiper/swiper-bundle.js",
    "node_modules/wow.js/dist/wow.js",
    "src/js/main.js",
  ])
    .pipe(concat("main.min.js"))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write("./"))
    .pipe(dest("src/js"))
    .pipe(browserSync.stream());
};

// WATCHING
const watching = () => {
  watch("src/scss/**/*.+(scss|sass)", styles);
  watch("src/js/main.js", scripts);
  watch("src/*.html").on("change", browserSync.reload);
};

exports.server = server;
exports.styles = styles;
exports.watching = watching;
exports.scripts = scripts;

exports.default = parallel(styles, scripts, watching, server);
