// Karma configuration

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'browserify'],
    files: [
      'test/index.js'
    ],
    exclude: [],
    preprocessors: {
      'test/index.js': ['browserify']
    },
    browserify: {
      debug: true,
      transform: [
        ['babelify', { plugins: ['istanbul'] }]
      ]
    },
    reporters: ['mocha', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['FirefoxHeadless'],
    browserNoActivityTimeout: 30000,
    singleRun: true,
    concurrency: Infinity,

    coverageReporter: {
      reporters: [
        {
          type: 'lcovonly',
          dir: 'coverage',
          subdir: function () {
            return '.'; // we need to have a single report directly in the `coverage` dir
          }
        },
        { type: 'text-summary' }
      ]
    }
  });
};
