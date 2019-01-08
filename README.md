# extended-debugging-JS-examples

This repository contains sample script of performance custom commands by using following JS frameworks

- [x] WebDriver.IO
- [x] Nightwatch
- [x] Protractor
- [x] Cucumber (JS)
- [x] Webdriver-Selenium with Mocha


### Environment Setup

1. Global Dependencies
    * Install [Node.js](https://nodejs.org/en/)
    * Or Install Node.js with [Homebrew](http://brew.sh/)
    ```
    $ brew install node
    ```
    * Install Grunt Globally
    ```
    $ npm install -g grunt-cli
    ```
2. Sauce Credentials
    * In the terminal export your Sauce Labs Credentials as environmental variables:
    ```
    $ export SAUCE_USERNAME=<your Sauce Labs username>
	$ export SAUCE_ACCESS_KEY=<your Sauce Labs access key>
    ```
3. Project Dependencies
    * Choose any of above framework (as example let's use Webdriver.io)
    ```
    $ cd WebDriver.io
    ```
    * Install Node modules
    ```
    $ npm install
    ```

### Running Tests
	$ npm test

### Performance Regression Tests

In demo app, we have `performance_glitch_user` user to test performance regression. By using this user PageLoad time will be increased by 5s and existing test case will be failed.
	

	$ npm run regression:test


[Sauce Labs Dashboard](https://app.saucelabs.com/dashboard)


### Advice/Troubleshooting

1. There may be additional latency when using a remote webdriver to run tests on Sauce Labs. Timeouts or Waits may need to be increased.
    * [Selenium tips regarding explicit waits](https://wiki.saucelabs.com/display/DOCS/Best+Practice%3A+Use+Explicit+Waits)

### Resources
##### [Performance Documentation](https://wiki.saucelabs.com/display/DOCS/Front+End+Performance+Metrics+Reference)

##### [Sauce Labs Documentation](https://wiki.saucelabs.com/)

##### [SeleniumHQ Documentation](http://www.seleniumhq.org/docs/)

##### [Node Documentation](https://nodejs.org/en/docs/)

##### [Mocha Documentation](https://mochajs.org/)

##### [Stack Overflow](http://stackoverflow.com/)
