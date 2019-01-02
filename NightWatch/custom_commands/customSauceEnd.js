const SauceLabs = require('saucelabs');

exports.command = function customSauce(callback) {
	const saucelabs = new SauceLabs({
		username: process.env.SAUCE_USERNAME,
		password: process.env.SAUCE_ACCESS_KEY,
	});

	const self = this;
	const sessionid = this.capabilities['webdriver.remote.sessionid'];
	const jobName = this.currentTest.name;
	const passed = this.currentTest.results.testcases[jobName].failed === 0;

	console.log(`SauceOnDemandSessionID=${sessionid} job-name=${jobName}`);

	saucelabs.updateJob(sessionid, {
		passed,
		name: jobName,
	}, () => {
		self.end(callback);
	});
};
