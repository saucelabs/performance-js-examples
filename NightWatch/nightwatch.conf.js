module.exports = ((defaultSetting) => {
	const settings = defaultSetting;
	if (process.env.SELENIUM_HOST) {
		settings.selenium_server.selenium.host = process.env.SELENIUM_HOST;
	}
	if (process.env.SELENIUM_PORT) {
		settings.selenium_server.selenium.host = process.env.SELENIUM_PORT;
	}
	return settings;
})(require('./nightwatch.json'));
