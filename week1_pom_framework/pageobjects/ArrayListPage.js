import { $, driver, browser } from '@wdio/globals';
import BasePage from './BasePage.js';

const FIRST_ITEM = 'Abbaye de Belloc';

// Views > Lists > 01. Array
export default class ArrayListPage extends BasePage {

    async open() {
        await this.navigateTo('Views', 'Lists', '01. Array');
    }

    async scrollToItem(name) {
        return browser.scrollUntilVisible(this.textSelector(name));
    }

    async selectItem(name) {
        const item = await this.scrollToItem(name);
        await item.click();
    }

    async isItemVisible(name) {
        return this.byText(name).isExisting();
    }

    async scrollToTop() {
        const list = await $('android.widget.ListView');
        await list.waitForExist({ timeout: 10000 });

        let attempts = 0;
        while (!(await this.isItemVisible(FIRST_ITEM)) && attempts < 15) {
            await driver.execute('mobile: scrollGesture', {
                elementId: list.elementId,
                direction: 'up',
                percent: 1.0,
            });
            attempts++;
        }
    }

    async firstItemText() {
        const firstItem = await this.byText(FIRST_ITEM);
        await firstItem.waitForDisplayed({ timeout: 10000 });
        return firstItem.getText();
    }
}
