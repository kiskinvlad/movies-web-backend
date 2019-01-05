const { task, gulp, src, dest } = require("gulp");
const source = require('vinyl-source-stream');
const tsify = require("tsify");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const paths = {
    pages: ['src/static/*.html'],
    env: ['.env'],
    spec: ['src/tests/unit/*.spec.ts']

};
/**
 * Copy html to dist folder
 */
const copyHtml = function () {
    return src(paths.pages)
        .pipe(dest("dist"));
};
/**
 * Copy .env file to dist folder
 */
const copyEnv = function () {
    return src(paths.env)
        .pipe(dest("dist"));
};
/**
 * Copy test files to dist folder
 */
const copySpec = function () {
    return src(paths.spec)
        .pipe(dest("dist/tests"));
};
/**
 * Default gulp task which include tasks below
 */
function defaultTask(cb) {
    copyHtml();
    copyEnv();
    copySpec();
    tsProject.src()
        .pipe(tsProject())
        .js.pipe(dest("dist"));
    cb();
}

exports.default = defaultTask