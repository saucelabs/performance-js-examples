const assert = require('assert');
const { config } = require('../conf.js');

describe('Performance Testing', () => {
	beforeAll(() => {
		browser.waitForAngularEnabled(false);
		browser.get('/');
		element(by.css('[data-test="username"]')).sendKeys(process.env.PERF_USERNAME || 'standard_user');
		element(by.css('[data-test="password"]')).sendKeys('secret_sauce');
		element(by.css('.login-button')).click();
		browser.get('/inventory.html');
	});

	it('log (sauce:performance) should check speedIndex', async () => {
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
		const performance = await browser.executeScript('sauce:log', { type: 'sauce:performance' });
		metrics.forEach(metric => assert.ok(metric in performance, `${metric} metric is missing`));
	});

	it('(sauce:performance) custom command should assert performance has not regressed', async () => {
		const output = await browser.executeScript('sauce:performance', {
			name: config.capabilities.name,
			metrics: ['load'],
		});
		assert.equal(output.result, 'pass', output.reason);
	});

	it('(sauce:performance) custom command should assert speedIndex has not regressed', async () => {
		const output = await browser.executeScript('sauce:performance', {
			name: config.capabilities.name,
			metrics: ['speedIndex'],
		});
		assert.equal(output.result, 'pass', output.reason);
	});
});
