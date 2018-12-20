var https = require('https');
var SauceLabs = require("saucelabs");
var assert = require('assert');

module.exports = {

    '@tags': ['Performance Demo Test'],

    'Performance Testing': function(browser) {
        browser
            .url('https://www.saucedemo.com/')
            .waitForElementVisible('body', 1000)
            .setValue('input[data-test="username"]', 'standard_user')
            .setValue('input[data-test="password"]', 'secret_sauce')
            .click('.login-button')
            .waitForElementVisible('body', 1000)
            .getLog('sauce:network', function(network) {
                const isRequestExists = network.some((req) => req.url.includes('main.js'))
                assert.strictEqual(isRequestExists, true);
            }).getLog('sauce:metrics', function(metrics) {
                const pageLoadTime = metrics.domContentLoaded - metrics.navigationStart
                assert.ok(pageLoadTime <= 5, `Expected page load time to be lower than 5s but was ${pageLoadTime}s`)
            }).getLog('sauce:timing', function(timing) {
                assert.ok('domLoading' in timing, `domLoading is missing`)
            }).getLog('sauce:performance', function(performance) {
                const metrics = [
                    'load',
                    'speedIndex',
                    'pageWeight',
                    'pageWeightEncoded',
                    'timeToFirstByte',
                    'timeToFirstInteractive',
                    'firstContentfulPaint',
                    'perceptualSpeedIndex',
                    'domContentLoaded'
                ];
                metrics.forEach((metric) => assert.ok(metric in performance, `${metric} metric is missing`));
            }).execute('sauce:hello', {
                name: browser.currentTest.name
            }, function({ value }) {
                assert.ok(value.includes(browser.currentTest.name), `Test name is missing`)
            });
    },

    afterEach: function(client, done) {
        client.customSauceEnd();

        setTimeout(function() {
            done();
        }, 1000);

    }

};
