exports.config = {
    sauceUser: process.env.SAUCE_USERNAME,
    sauceKey: process.env.SAUCE_ACCESS_KEY,
    specs: ['specs/*spec.js'],
    capabilities: {
        platform: "OS X 10.10",
        version: "70.0",
        browserName: "chrome",
        extendedDebugging: true,
        crmuxdriverVersion: "stable",
        name: "Performance Testing",
        loggingPrefs: {
            'driver': 'ALL',
            'browser': 'ALL',
            'performance': 'ALL',
            'server': 'ALL'
        },
        chromeOptions: {
            perfLoggingPrefs: {
                enableNetwork: true,
                enablePage: true
            }
        }
    },
    baseUrl: 'https://www.saucedemo.com',
    onComplete: function () {
        var printSessionId = function (jobName) {
            browser.getSession().then(function (session) {
                console.log('SauceOnDemandSessionID=' + session.getId() + ' job-name=' + jobName);
            });
        }
        printSessionId("Performance Testing");
    }
}
