const assert = require('assert')

describe('Performance Demo Test', () => {
    before(() => {
        browser.url('/');
        const username = $('[data-test="username"]')
        const password = $('[data-test="username"]')
        const loginButton = $('.login-button')
        username.setValue('standard_user')
        password.setValue('secret_sauce')
        loginButton.click()
    })

    it('(sauce:network) should make a request for main.js', () => {
        const { value: requests } = browser.getLogs('sauce:network')
        const isRequestExists = requests.some((req) => req.url.includes('main.js'))
        assert.strictEqual(isRequestExists, true);
    })

    it('(sauce:metrics) should check pageLoadTime', () => {
        const { value: metrics } = browser.getLogs('sauce:metrics');
        const pageLoadTime = metrics.domContentLoaded - metrics.navigationStart
        assert.ok(pageLoadTime <= 5, `Expected page load time to be lower than 5s but was ${pageLoadTime}s`)
    })

    it('(sauce:timing) should check timing', () => {
        const { value: timing } = browser.getLogs('sauce:timing');
        assert.ok('domLoading' in timing, `domLoading is missing`)
    })

    it('(sauce:performance) should check speedIndex', () => {
        const { value: performance } = browser.getLogs('sauce:performance');
        assert.ok('speedIndex' in performance, `SpeedIndex is missing`)
    })

    it('(sauce:hello) should return test name', () => {
        const { value: output } = browser.execute('sauce:hello', {
            name: browser.desiredCapabilities.name
        });
        assert.ok(output.includes(browser.desiredCapabilities.name), `Test name is missing`)
    })
})
