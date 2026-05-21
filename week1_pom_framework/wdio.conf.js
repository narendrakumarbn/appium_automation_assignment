import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import allureCommandline from 'allure-commandline';
import allureReporter from '@wdio/allure-reporter';
import { driver } from '@wdio/globals';
import registerCustomCommands from './test/support/customCommands.js';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const ALLURE_RESULTS = path.join(projectRoot, 'allure-results');
const ALLURE_REPORT = path.join(projectRoot, 'allure-report');

// pick the target device with the DEVICE env var, defaults to pixel5
const deviceProfiles = {
    pixel5: {
        'appium:deviceName': 'emulator-5554',
        'appium:platformVersion': '17',
    },
    pixel4: {
        'appium:deviceName': 'emulator-5556',
        'appium:platformVersion': '10',
    },
};

const selectedDevice = process.env.DEVICE || 'pixel5';
const deviceProfile = deviceProfiles[selectedDevice];
if (!deviceProfile) {
    throw new Error(
        `Unknown DEVICE "${selectedDevice}". ` +
        `Valid values: ${Object.keys(deviceProfiles).join(', ')}`
    );
}
console.log(`[wdio.conf] Target device: ${selectedDevice} (${deviceProfile['appium:deviceName']})`);

export const config = {
    runner: 'local',
    port: 4723,

    specs: ['./test/specs/**/*.js'],
    exclude: [],

    maxInstances: 1,

    capabilities: [{
        'appium:platformName': 'Android',
        'appium:automationName': 'UiAutomator2',
        ...deviceProfile,
        'appium:app': path.join(projectRoot, 'app', 'android', 'ApiDemos-release.apk'),
        'appium:noReset': true,
        'appium:ignoreHiddenApiPolicyError': true,
        'appium:autoGrantPermissions': true,
    }],

    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    // re-run a whole spec file once if it crashes
    specFileRetries: 1,
    specFileRetriesDeferred: true,

    services: [],
    framework: 'mocha',

    reporters: [
        'spec',
        ['allure', {
            outputDir: ALLURE_RESULTS,
            // we attach our own screenshots and steps, so silence the automatic noise
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: true,
        }],
    ],

    before: function () {
        registerCustomCommands();
    },

    mochaOpts: {
        ui: 'bdd',
        timeout: 120000,
        // retry an individual flaky test once
        retries: 1,
    },

    // clear stale allure results before the run
    onPrepare: function () {
        for (const dir of [ALLURE_RESULTS, ALLURE_REPORT]) {
            fs.rmSync(dir, { recursive: true, force: true });
        }
        console.log('[wdio.conf] Cleared previous Allure results and report.');
    },

    // on failure, grab a screenshot and attach it to the test
    afterTest: async function (test, context, { passed }) {
        if (passed) {
            return;
        }
        try {
            const screenshot = await driver.takeScreenshot();
            allureReporter.addAttachment(
                `FAILED - ${test.title}`,
                Buffer.from(screenshot, 'base64'),
                'image/png'
            );
            console.log(`[wdio.conf] Failure screenshot attached for: ${test.title}`);
        } catch (err) {
            console.error(`[wdio.conf] Could not capture failure screenshot: ${err.message}`);
        }
    },

    // build the single-file html report once the suite finishes
    onComplete: function () {
        console.log('[wdio.conf] Generating Allure report...');
        const generation = allureCommandline([
            'generate', ALLURE_RESULTS, '--single-file', '--clean', '-o', ALLURE_REPORT,
        ]);

        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                console.error('[wdio.conf] Allure report generation timed out.');
                resolve();
            }, 60000);

            generation.on('exit', (exitCode) => {
                clearTimeout(timeout);
                if (exitCode === 0) {
                    console.log(`[wdio.conf] Allure report ready: ${path.join(ALLURE_REPORT, 'index.html')}`);
                } else {
                    console.error(`[wdio.conf] Allure report generation failed (exit ${exitCode}).`);
                }
                resolve();
            });
        });
    },
};
