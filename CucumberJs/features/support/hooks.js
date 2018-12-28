const { Before, After } = require('cucumber');
const SauceLabs = require('saucelabs');
const { remote } = require('webdriverio');

const options = {
	user: process.env.SAUCE_USERNAME,
	key: process.env.SAUCE_ACCESS_KEY,
	protocol: 'https',
	logLevel: 'error',
	capabilities: {
		browserName: 'chrome',
		platform: 'macOS 10.13',
		version: '70',
		extendedDebugging: true,
		crmuxdriverVersion: 'stable',
	},
};

const updateStatus = (sessionId, status, done) => {
	const sauceAccount = new SauceLabs({
		username: process.env.SAUCE_USERNAME,
		password: process.env.SAUCE_ACCESS_KEY,
	});
	sauceAccount.updateJob(sessionId, status, done);
};

Before(async function beforeHook(testInfo) {
	this.testName = testInfo.pickle.name;
	this.browser = await remote(options);
});

After(function afterHook(testInfo, done) {
	this.browser.deleteSession().then(() => {
		updateStatus(this.browser.sessionId, {
			passed: !!(testInfo.result.status === 'passed'),
			name: testInfo.pickle.name,
			public: true,
		}, done);
	});
});
