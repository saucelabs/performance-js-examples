const assert = require('assert');
const { Builder, By } = require('selenium-webdriver');
const SauceLabs = require('saucelabs');

const username = process.env.SAUCE_USERNAME;
const accessKey = process.env.SAUCE_ACCESS_KEY;
const saucelabs = new SauceLabs({
	username,
	password: accessKey,
});

const server = `http://${username}:${accessKey}@ondemand.saucelabs.com:80/wd/hub`;
const capabilities = {
	platform: 'OS X 10.10',
	version: '70.0',
	browserName: 'chrome',
	extendedDebugging: true,
	name: 'Performance Testing',
};
let driver;
let isTestPassed = true;

describe('Performance Testing', () => {
	before(async () => {
		driver = await new Builder()
			.withCapabilities(capabilities)
			.usingServer(server)
			.build();
		driver.sessionID = await driver.getSession();
		await driver.get('https://www.saucedemo.com/');
		await driver.findElement(By.css('[data-test="username"]')).sendKeys(process.env.PERF_USERNAME || 'standard_user');
		await driver.findElement(By.css('[data-test="password"]')).sendKeys('secret_sauce');
		await driver.findElement(By.css('.login-button')).click();
		await driver.get('https://www.saucedemo.com/inventory.html');
	});

	afterEach(function hook() {
		isTestPassed = isTestPassed ? !!(this.currentTest.state === 'passed') : isTestPassed;
	});

	after((done) => {
		driver.quit();
		saucelabs.updateJob(driver.sessionID.id_, { // eslint-disable-line
			name: capabilities.name,
			passed: isTestPassed,
		}, done);
	});

	it('(sauce:network) should make a request for main.js', async () => {
		const network = await driver.executeScript('sauce:log', { type: 'sauce:network' });
		const isRequestExists = network.some(req => req.url.includes('main.js'));
		assert.strictEqual(isRequestExists, true);
	});

	it('(sauce:metrics) should check pageLoadTime', async () => {
		const metrics = await driver.executeScript('sauce:log', { type: 'sauce:metrics' });
		const pageLoadTime = metrics.domContentLoaded - metrics.navigationStart;
		assert.ok(pageLoadTime <= 5, `Expected page load time to be lower than 5s but was ${pageLoadTime}s`);
	});

	it('(sauce:timing) should check timing', async () => {
		const timing = await driver.executeScript('sauce:log', { type: 'sauce:timing' });
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
		const performance = await driver.executeScript('sauce:log', { type: 'sauce:performance' });
		metrics.forEach(metric => assert.ok(metric in performance, `${metric} metric is missing`));
	});

	it('(sauce:hello) should return test name', async () => {
		const output = await driver.executeScript('sauce:hello', {
			name: capabilities.name,
		});
		assert.ok(output.includes(capabilities.name), 'Test name is missing');
	});
});
