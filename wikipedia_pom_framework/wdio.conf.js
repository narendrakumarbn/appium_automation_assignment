import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import allure from 'allure-commandline';
import allureReporter from '@wdio/allure-reporter';
import registerCustomCommands from './test/support/customCommands.js';

// paths resolved relative to this file so the suite runs from anywhere
const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.join(projectRoot, 'screenshots');
const allureResultsDir = path.join(projectRoot, 'allure-results');
const allureReportDir = path.join(projectRoot, 'allure-report');

// pick the target device with the DEVICE env var, e.g. $env:DEVICE='pixel4'
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
        'appium:app': path.join(projectRoot, 'app', 'android', 'wikipedia.apk'),
        'appium:appPackage': 'org.wikipedia',
        'appium:appActivity': 'org.wikipedia.main.MainActivity',
        // keep app data so onboarding reappears and the run is repeatable
        'appium:noReset': false,
        'appium:fullReset': false,
        'appium:autoGrantPermissions': true,
        'appium:newCommandTimeout': 240,
        'appium:ignoreHiddenApiPolicyError': true,
        'appium:printPageSourceOnFindFailure': true,
    }],

    logLevel: 'info',
    bail: 0,
    waitforTimeout: 15000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    // re-run a failed spec once in a fresh session; set RETRIES=0 to disable
    specFileRetries: Number(process.env.RETRIES ?? 1),
    specFileRetriesDelay: 0,
    specFileRetriesDeferred: false,

    services: [],
    framework: 'mocha',

    reporters: [
        'spec',
        ['allure', {
            outputDir: allureResultsDir,
            disableWebdriverStepsReporting: false,
            disableWebdriverScreenshotsReporting: false,
        }],
    ],

    before: function () {
        registerCustomCommands();
    },

    // clear artefacts so a retry doesn't show stale screenshots/logs
    onPrepare: function () {
        for (const dir of [screenshotsDir, allureResultsDir]) {
            fs.rmSync(dir, { recursive: true, force: true });
            fs.mkdirSync(dir, { recursive: true });
        }
    },

    // on failure, save a screenshot to disk and to allure
    afterTest: async function (test, context, { passed }) {
        if (passed) {
            return;
        }
        const stamp = new Date().toISOString().replace(/[:.]/g, '-');
        const safeTitle = test.title.replace(/[^a-z0-9]+/gi, '_').slice(0, 50);

        try {
            const pngFile = path.join(screenshotsDir, `FAILED_${safeTitle}_${stamp}.png`);
            await browser.saveScreenshot(pngFile);
            allureReporter.addAttachment(
                'Screenshot on failure',
                fs.readFileSync(pngFile),
                'image/png'
            );
            console.log(`[afterTest] Test failed - screenshot saved: ${pngFile}`);
        } catch (err) {
            console.log(`[afterTest] Could not capture failure screenshot: ${err.message}`);
        }
    },

    // build a self-contained html report so npm test produces it automatically.
    // --single-file inlines everything so index.html opens without a server.
    onComplete: function () {
        const generation = allure([
            'generate', allureResultsDir, '--clean', '--single-file', '-o', allureReportDir,
        ]);
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(
                () => reject(new Error('Timed out generating the Allure report')),
                60000
            );
            generation.on('exit', (exitCode) => {
                clearTimeout(timeout);
                if (exitCode !== 0) {
                    console.log('[onComplete] Allure report generation failed.');
                    return reject(new Error('Could not generate Allure report'));
                }
                console.log(`[onComplete] Allure report generated: ${path.join(allureReportDir, 'index.html')}`);
                console.log('[onComplete] Just open that index.html in a browser - no server needed.');
                resolve();
            });
        });
    },

    mochaOpts: {
        ui: 'bdd',
        timeout: 300000,
    },
};
