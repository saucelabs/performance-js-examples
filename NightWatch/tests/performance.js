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
			.execute('sauce:performance', {
				name: browser.currentTest.name,
				metrics: ['load'],
			}, ({ value }) => {
				assert.equal(value.result, 'pass', value.reason);
			})
			.execute('sauce:performance', {
				name: browser.currentTest.name,
				metrics: ['speedIndex'],
			}, ({ value }) => {
				assert.equal(value.result, 'pass', value.reason);
			});
	},

	afterEach(client, done) {
		client.customSauceEnd();
		setTimeout(() => {
			done();
		}, 1000);
	},
};
