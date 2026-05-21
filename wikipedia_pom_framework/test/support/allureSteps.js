import allureReporter from '@wdio/allure-reporter';

// wraps a phase of the scenario in a named allure step
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
