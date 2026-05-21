import { browser } from '@wdio/globals';
import allureReporter from '@wdio/allure-reporter';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const screenshotsDir = path.join(
    path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'screenshots'
);

// saves a png under /screenshots and attaches it to the allure report
export async function captureScreenshot(label) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeLabel = label.replace(/[^a-z0-9]+/gi, '_').slice(0, 50);
    const file = path.join(screenshotsDir, `${safeLabel}_${stamp}.png`);

    fs.mkdirSync(screenshotsDir, { recursive: true });
    await browser.saveScreenshot(file);
    allureReporter.addAttachment(label, fs.readFileSync(file), 'image/png');
    console.log(`[screenshot] ${label} -> ${file}`);
    return file;
}
