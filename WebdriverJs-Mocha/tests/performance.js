/* eslint ignore */
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
	crmuxdriverVersion: 'experimental',
};

let driver;
let isTestPassed = true;

describe('Performance Testing', () => { // eslint-disable-line func-names
	const { title } = this;

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
	});

	afterEach(function hook() {
		isTestPassed = isTestPassed ? !!(this.currentTest.state === 'passed') : isTestPassed;
	});

	after((done) => {
		driver.quit();
		saucelabs.updateJob(driver.sessionID.id_, { // eslint-disable-line
			name: 'Performance Testing 218',
			passed: isTestPassed,
		}, done);
	});

	it('logs (sauce:performance) should check speedIndex', async () => {
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
	function timeout(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	it('(sauce:performance) custom command should assert pageLoad has not regressed', async () => {
		await timeout(3000);
		driver.sleep(20000);

		const output = await driver.executeScript('sauce:performance', {
			name: title,
		});
		assert.equal(output.result, 'pass', output.reason);
	});

	it('(sauce:performance) custom command should assert speedIndex has not regressed', async () => {
		await timeout(3000);
		driver.sleep(20000);

		const output = driver.execute('sauce:performance', {
			name: title,
			metrics: ['speedIndex'],
		});
		assert.equal(output.result, 'pass', output.reason);
	});
});
