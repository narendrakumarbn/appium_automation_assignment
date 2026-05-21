import { browser } from '@wdio/globals';

// registered once from the before hook in wdio.conf.js
export default function registerCustomCommands() {

    // scrolls the first scrollable container down until the element is visible
    browser.addCommand('scrollUntilVisible', async function (selector, maxScrolls = 60) {
        const isShown = async () => {
            const el = await this.$(selector);
            return (await el.isExisting()) && (await el.isDisplayed());
        };

        if (await isShown()) {
            return this.$(selector);
        }

        const scrollable = await this.$('android=new UiSelector().scrollable(true)');
        await scrollable.waitForExist({ timeout: 10000 });

        for (let i = 0; i < maxScrolls; i++) {
            // scrollGesture returns false once the end of the list is reached
            const canScrollMore = await this.execute('mobile: scrollGesture', {
                elementId: scrollable.elementId,
                direction: 'down',
                percent: 0.9,
            });

            if (await isShown()) {
                return this.$(selector);
            }
            if (!canScrollMore) {
                break;
            }
        }

        throw new Error(`scrollUntilVisible: "${selector}" not visible after scrolling.`);
    });

    // long-presses an element for the given duration (default 1000 ms)
    browser.addCommand('longPressElement', async function (selector, duration = 1000) {
        const el = await this.$(selector);
        await el.waitForDisplayed({ timeout: 10000 });

        await this.execute('mobile: longClickGesture', {
            elementId: el.elementId,
            duration,
        });

        return el;
    });
}
