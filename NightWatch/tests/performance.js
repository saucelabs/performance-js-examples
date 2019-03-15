const assert = require('assert');

module.exports = {
	'Performance Testing': (browser) => {
		browser
			.url('https://www.saucedemo.com/')
			.waitForElementVisible('body', 1000)
			.setValue('input[data-test="username"]', process.env.PERF_USERNAME || 'standard_user')
			.setValue('input[data-test="password"]', 'secret_sauce')
			.click('.btn_action')
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
				const { reason, result, details } = value;
				return result !== 'pass'
					? assert.equal(details.load.actual < 5000, true, reason)
					: assert(result, 'pass');
			})
			.execute('sauce:performance', {
				name: browser.currentTest.name,
				metrics: ['timeToFirstInteractive'],
			}, ({ value }) => {
				const { reason, result, details } = value;
				return result !== 'pass'
					? assert.equal(details.timeToFirstInteractive.actual < 5000, true, reason)
					: assert(result, 'pass');
			});
	},

	afterEach(client, done) {
		client.customSauceEnd();
		setTimeout(() => {
			done();
		}, 1000);
	},
};
