const assert = require('assert');

describe('Performance Testing', function () { // eslint-disable-line func-names
	const { title } = this;
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

	it('(sauce:performance) custom command should assert pageload has not regressed', () => {
		const output = browser.execute('sauce:performance', {
			name: title,
			metrics: ['load'],
		});
		assert.equal(output.result, 'pass');
	});

	it('(sauce:performance) custom command should assert speedIndex has not regressed', () => {
		const output = browser.execute('sauce:performance', {
			name: title,
			metrics: ['speedIndex'],
		});
		assert.equal(output.result, 'pass');
	});
});
