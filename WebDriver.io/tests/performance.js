const assert = require('assert');

describe('Performance Testing', function () { // eslint-disable-line func-names
	const { title } = this;
	before(() => {
		browser.url('/');
		const username = $('[data-test="username"]');
		username.setValue(process.env.PERF_USERNAME || 'standard_user');
		const password = $('[data-test="password"]');
		password.setValue('secret_sauce');
		const loginButton = $('.btn_action');
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
		const metric = 'load';
		const output = browser.execute('sauce:performance', {
			name: title,
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
			? assert.equal(details[metric].actual < 5000, true, reason)
			: assert(result, 'pass');
	});

	it('(sauce:performance) custom command should assert timeToFirstInteractive has not regressed', () => {
		const metric = 'load';
		const output = browser.execute('sauce:performance', {
			name: title,
			metrics: [metric],
		});
		const { reason, result, details } = output;
		return result !== 'pass'
			? assert.equal(details[metric].actual < 5000, true, reason)
			: assert(result, 'pass');
	});
});
