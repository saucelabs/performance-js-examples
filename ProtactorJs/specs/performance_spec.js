const assert = require('assert');
const { config } = require('../conf.js');

describe('Performance Testing', () => {
	beforeEach(() => {
		browser.waitForAngularEnabled(false);
		browser.get('/');
		element(by.css('[data-test="username"]')).sendKeys(process.env.PERF_USERNAME || 'standard_user');
		element(by.css('[data-test="password"]')).sendKeys('secret_sauce');
		element(by.css('.login-button')).click();
		browser.get('/inventory.html');
	});

	it('(sauce:network) should make a request for main.js', async () => {
		const network = await browser.executeScript('sauce:log', { type: 'sauce:network' });
		const isRequestExists = network.some(req => req.url.includes('main.js'));
		assert.strictEqual(isRequestExists, true);
	});

	it('(sauce:metrics) should check pageLoadTime', async () => {
		const metrics = await browser.executeScript('sauce:log', { type: 'sauce:metrics' });
		const pageLoadTime = metrics.domContentLoaded - metrics.navigationStart;
		assert.ok(pageLoadTime <= 5, `Expected page load time to be lower than 5s but was ${pageLoadTime}s`);
	});

	it('(sauce:timing) should check timing', async () => {
		const timing = await browser.executeScript('sauce:log', { type: 'sauce:timing' });
		assert.ok('domLoading' in timing, 'domLoading is missing');
	});

	it('(sauce:performance) should check speedIndex', async () => {
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

	it('(sauce:hello) should return test name', async () => {
		const output = await browser.executeScript('sauce:hello', {
			name: config.capabilities.name,
		});
		assert.ok(output.includes(config.capabilities.name), 'Test name is missing');
	});
});
