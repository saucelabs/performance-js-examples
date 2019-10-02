const assert = require('assert')

describe('should test the jankiness', () => {
    it('tests jankiness with non optimized behavior', async () => {
        browser.get('https://googlechrome.github.io/devtools-samples/jank/')

        const addBtn = await element(by.css('.add'))
        for (let i = 0; i < 10; i += 1) {
            await addBtn.click() // eslint-disable-line
        }

        const jankiness = await browser.executeScript('sauce:jankinessCheck')
        /**
         * returns following JSON object
         *
         * {
               "url":"https://googlechrome.github.io/devtools-samples/jank/",
               "timestamp":1570026846192,
               "value":{
                  "metrics":{
                     "averageFPS":30.37006789013138,
                     "scriptingTime":713,
                     "renderingTime":45,
                     "otherTime":1598,
                     "idleTime":2122,
                     "forcedReflowWarningCounts":440,
                     "scrollTime":5210,
                     "paintingTime":732,
                     "memoryUsageDiff":-2964452
                  },
                  "diagnostics":{
                     "layoutUpdateScore":0.9869911007302723,
                     "fpsScore":0.5061677981688564,
                     "idleDurationScore":0.4072936660268714,
                     "memoryUsageScore":1
                  }
               },
               "score":0.6428077742596429,
               "loaderId":"b0099410-e521-11e9-b752-8375edd9807f",
               "type":"scroll"
         * }
         */
        assert.ok(jankiness.score < 0.7)
    })

    it('should get better results after optimizing animation', async () => {
        const optimizeBtn = await element(by.css('.optimize'))
        await optimizeBtn.click()

        const jankiness = await browser.executeScript('sauce:jankinessCheck')
        assert.ok(jankiness.score > 0.9, `Score (${jankiness.score}) is lower than 0.9`)
    })
})
