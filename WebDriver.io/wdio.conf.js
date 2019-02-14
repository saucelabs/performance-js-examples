exports.config = {
	user: process.env.SAUCE_USERNAME,
	key: process.env.SAUCE_ACCESS_KEY,
	specs: [
		'./tests/**/*.js',
	],
	maxInstances: 40,
	capabilities: [{
		browserName: 'chrome',
		platform: 'macOS 10.12',
		version: '70.0',
		extendedDebugging: true,
	}, {
		browserName: 'chrome',
		platform: 'macOS 10.14',
		version: '71.0',
		extendedDebugging: true,
	}, {
		browserName: 'chrome',
		platform: 'macOS 10.14',
		version: '71.0',
		extendedDebugging: true,
	}, {
		browserName: 'chrome',
		platform: 'Windows 10',
		version: '70.0',
		extendedDebugging: true,
	}, {
		browserName: 'chrome',
		platform: 'Windows 8.1',
		version: '70.0',
		extendedDebugging: true,
	}, {
		browserName: 'chrome',
		platform: 'Windows 8',
		version: '71.0',
		extendedDebugging: true,
	}, {
		browserName: 'chrome',
		platform: 'Windows 7',
		version: '71.0',
		extendedDebugging: true,
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
	reporters: ['dot', 'spec'],
	reporterOptions: {
		outputDir: './',
	},
	mochaOpts: {
		ui: 'bdd',
		timeout: 100000,
	},
};
