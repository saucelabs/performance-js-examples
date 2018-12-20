const assert = require('assert')

describe('Performance Demo Test', () => {
    before(() => {
        browser.url('/');
        const username = $('[data-test="username"]')
        username.setValue('standard_user')
        const password = $('[data-test="password"]')
        password.setValue('secret_sauce')
        const loginButton = $('.login-button')
        loginButton.click()
    })

    it('(sauce:network) should make a request for main.js', () => {
        const network = browser.getLogs('sauce:network')
        const isRequestExists = network.some((req) => req.url.includes('main.js'))
        assert.strictEqual(isRequestExists, true);
    })

    it('(sauce:metrics) should check pageLoadTime', () => {
        const metrics = browser.getLogs('sauce:metrics');
        const pageLoadTime = metrics.domContentLoaded - metrics.navigationStart
        assert.ok(pageLoadTime <= 5, `Expected page load time to be lower than 5s but was ${pageLoadTime}s`)
    })

    it('(sauce:timing) should check timing', () => {
        const timing = browser.getLogs('sauce:timing');
        assert.ok('domLoading' in timing, `domLoading is missing`)
    })

    it('(sauce:performance) should check speedIndex', () => {
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
        const performance = browser.getLogs('sauce:performance');
        metrics.forEach((metric) => assert.ok(metric in performance, `${metric} metric is missing`));
    })

    it('(sauce:hello) should return test name', () => {
        const output = browser.execute('sauce:hello', {
            name: browser.config.capabilities.name
        });
        assert.ok(output.includes(browser.config.capabilities.name), `Test name is missing`)
    })
})
