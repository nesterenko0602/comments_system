var webpackConfig = require('./testing.webpack');

module.exports = function(config) {
    config.set({
        // конфигурация репортов о покрытии кода тестами
        browserNoActivityTimeout: 100000,
        captureTimeout: 60000,
        coverageReporter: {
          dir:'coverage/',
          reporters: [
            { type:'html', subdir: 'report-html' }
          ],
          instrumenterOptions: {
            istanbul: { noCompact: true }
          }
        },
        // spec файлы, условимся называть по маске **_*.spec.js_**
        files: [
            'node_modules/babel-polyfill/dist/polyfill.js',
            'app/components/__test__/*.spec.js'
        ],
        frameworks: [ 'jasmine', 'jasmine-matchers'],
        reporters: ['kjhtml', 'coverage'],
        preprocessors: {
            'app/components/__test__/*.spec.js': ['webpack', 'babel']
        },
        plugins: [
          'karma-jasmine', 'karma-jasmine-html-reporter', 'karma-jasmine-matchers',
          'karma-coverage',
          'karma-webpack', 'karma-phantomjs-launcher',
          'karma-babel-preprocessor', 'karma-sourcemap-loader'
        ],
        // передаем конфигурацию webpack
        webpack: webpackConfig,
        webpackMiddleware: {
          noInfo:true
        }
    });
};
