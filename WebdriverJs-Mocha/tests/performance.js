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
	name: 'Performance Testing',
};

let driver;
let isTestPassed = true;

describe('Performance Testing', () => { // eslint-disable-line func-names
	before(async () => {
		driver = await new Builder()
			.withCapabilities(capabilities)
			.usingServer(server)
			.build();
		driver.sessionID = await driver.getSession();
		await driver.get('https://www.saucedemo.com/');
		await driver.findElement(By.css('[data-test="username"]')).sendKeys(process.env.PERF_USERNAME || 'standard_user');
		await driver.findElement(By.css('[data-test="password"]')).sendKeys('secret_sauce');
		await driver.findElement(By.css('.btn_action')).click();
	});

	afterEach(function hook() {
		isTestPassed = isTestPassed ? !!(this.currentTest.state === 'passed') : isTestPassed;
	});

	after((done) => {
		driver.quit();
		saucelabs.updateJob(driver.sessionID.id_, { // eslint-disable-line
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
		const metric = 'load';
		const output = await driver.executeScript('sauce:performance', {
			name: capabilities.name,
			metrics: [metric],
		});

		const { reason, result, details } = output;
		return result !== 'pass'
			? assert.equal(details[metric].actual < 5000, true, reason)
			: assert(result, 'pass');
	});

	it('(sauce:performance) custom command should assert timeToFirstInteractive has not regressed', async () => {
		await timeout(3000);
		driver.sleep(20000);
		const metric = 'timeToFirstInteractive';
		const output = await driver.executeScript('sauce:performance', {
			name: capabilities.name,
			metrics: [metric],
		});

		const { reason, result, details } = output;
		/* The custom command will return 'pass' if the test falls within the predicted baseline
 		 * or 'fail'  if the performance metric falls outside the predicted baseline.
 		 * customers can decide how strict they want to be in failing tests by setting thier own
 		 * failure points.
 		 * assert(details[metric].actual < 5000, true, reason);
		 */
		return result !== 'pass'
			? assert.equal(details[metric.actual] < 5000, true, reason)
			: assert(result, 'pass');
	});
});
