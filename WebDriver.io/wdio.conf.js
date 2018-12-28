exports.config = {
	user: process.env.SAUCE_USERNAME,
	key: process.env.SAUCE_ACCESS_KEY,
	specs: [
		'./tests/**/*.js',
	],
	maxInstances: 40,
	capabilities: [{
		browserName: 'chrome',
		platform: 'OS X 10.10',
		version: '70.0',
		extendedDebugging: true,
		crmuxdriverVersion: 'stable',
		name: 'Performance testing',
	}],
	sync: true,
	logLevel: 'error',
	coloredLogs: true,
	baseUrl: 'https://www.saucedemo.com',
	waitforTimeout: 100000,
	connectionRetryTimeout: 90000,
	connectionRetryCount: 3,
	services: ['sauce'],
	framework: 'mocha',
	reporters: ['dot'],
	reporterOptions: {
		outputDir: './',
	},
	mochaOpts: {
		ui: 'bdd',
		timeout: 100000,
	},
};
