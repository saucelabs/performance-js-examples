const assert = require('assert');

module.exports = {

	'@tags': ['Performance Demo Test'],

	'Performance Testing': (browser) => {
		browser
			.url('https://www.saucedemo.com/')
			.waitForElementVisible('body', 1000)
			.setValue('input[data-test="username"]', process.env.PERF_USERNAME || 'standard_user')
			.setValue('input[data-test="password"]', 'secret_sauce')
			.click('.login-button')
			.url('https://www.saucedemo.com/inventory.html')
			.waitForElementVisible('body', 1000)
			.getLog('sauce:network', (network) => {
				const isRequestExists = network.some(req => req.url.includes('main.js'));
				assert.strictEqual(isRequestExists, true);
			})
			.getLog('sauce:metrics', (metrics) => {
				const pageLoadTime = metrics.domContentLoaded - metrics.navigationStart;
				assert.ok(pageLoadTime <= 5, `Expected page load time to be lower than 5s but was ${pageLoadTime}s`);
			})
			.getLog('sauce:timing', (timing) => {
				assert.ok('domLoading' in timing, 'domLoading is missing');
			})
			.getLog('sauce:performance', (performance) => {
				const metrics = [
					'load',
					'speedIndex',
					'pageWeight',
					'pageWeightEncoded',
					'timeToFirstByte',
					'timeToFirstInteractive',
					'firstContentfulPaint',
					'perceptualSpeedIndex',
					'domContentLoaded',
				];
				metrics.forEach(metric => assert.ok(metric in performance, `${metric} metric is missing`));
			})
			.execute('sauce:hello', {
				name: browser.currentTest.name,
			}, ({ value }) => {
				assert.ok(value.includes(browser.currentTest.name), 'Test name is missing');
			});
	},

	afterEach(client, done) {
		client.customSauceEnd();
		setTimeout(() => {
			done();
		}, 1000);
	},
};
