import allureReporter from '@wdio/allure-reporter';
import { driver } from '@wdio/globals';

// capture the current screen and attach it to the allure report.
// wrapped in try/catch so a failed screenshot never fails the test
export async function attachScreenshot(name) {
    try {
        const base64 = await driver.takeScreenshot();
        allureReporter.addAttachment(name, Buffer.from(base64, 'base64'), 'image/png');
        console.log(`[allure] screenshot attached: ${name}`);
    } catch (err) {
        console.error(`[allure] could not capture screenshot "${name}": ${err.message}`);
    }
}

// run fn inside a named allure step so the report shows it as one collapsible line
export async function step(name, fn) {
    allureReporter.startStep(name);
    try {
        const result = await fn();
        allureReporter.endStep('passed');
        return result;
    } catch (err) {
        allureReporter.endStep('failed');
        throw err;
    }
}
