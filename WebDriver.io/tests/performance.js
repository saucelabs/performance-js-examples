const assert = require('assert');

describe('Performance Demo Test', function () { // eslint-disable-line func-names
	const title = this.title;
	before(() => {
		browser.url('/');
		const username = $('[data-test="username"]');
		username.setValue(process.env.PERF_USERNAME || 'standard_user');
		const password = $('[data-test="password"]');
		password.setValue('secret_sauce');
		const loginButton = $('.login-button');
		loginButton.click();
		browser.url('/inventory.html');
	});

	it('(sauce:network) should make a request for main.js', () => {
		const network = browser.getLogs('sauce:network');
		const isRequestExists = network.some(req => req.url.includes('main.js'));
		assert.strictEqual(isRequestExists, true);
	});

	it('(sauce:metrics) pageLoadTime should be less than 5s', () => {
		const metrics = browser.getLogs('sauce:metrics');
		const pageLoadTime = metrics.domContentLoaded - metrics.navigationStart;
		assert.ok(pageLoadTime <= 5, `Expected page load time to be lower than 5s but was ${pageLoadTime}s`);
	});

	it('(sauce:timing) should check timing', () => {
		const timing = browser.getLogs('sauce:timing');
		assert.ok('domLoading' in timing, 'domLoading is missing');
	});

	it('logs (sauce:performance) should check speedIndex', () => {
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
		const performance = browser.getLogs('sauce:performance');
		metrics.forEach(metric => assert.ok(metric in performance, `${metric} metric is missing`));
	});

	it('(sauce:performance) custom command should assert performance has not regressed', () => {
		const output = browser.execute('sauce:performance', {
			name: title,
			metrics: ['load'],
		});
		assert.equal(output, true);
	});
});
