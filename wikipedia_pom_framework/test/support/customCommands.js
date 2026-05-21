import { browser } from '@wdio/globals';

// registered once from the before hook in wdio.conf.js
export default function registerCustomCommands() {

    // scrolls down until the selector is visible, then returns the element
    browser.addCommand('scrollUntilVisible', async function (selector, maxScrolls = 25) {
        const isVisible = async () => {
            const el = await this.$(selector);
            return el.isDisplayed().catch(() => false);
        };

        if (await isVisible()) {
            return this.$(selector);
        }

        const scrollable = await this.$('android=new UiSelector().scrollable(true)');
        await scrollable.waitForExist({ timeout: 10000 });

        for (let i = 0; i < maxScrolls; i++) {
            await this.execute('mobile: scrollGesture', {
                elementId: scrollable.elementId,
                direction: 'down',
                percent: 0.8,
            });
            if (await isVisible()) {
                return this.$(selector);
            }
        }

        throw new Error(`scrollUntilVisible: "${selector}" not visible after ${maxScrolls} scroll(s)`);
    });

    // taps the element only if it shows up within the timeout
    browser.addCommand('dismissIfPresent', async function (selector, timeoutMs = 1500) {
        const el = await this.$(selector);
        try {
            await el.waitForDisplayed({ timeout: timeoutMs });
        } catch {
            return false;
        }
        await el.click().catch(() => { /* pop-up vanished on its own */ });
        return true;
    });
}
