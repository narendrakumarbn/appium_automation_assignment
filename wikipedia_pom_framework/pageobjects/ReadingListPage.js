import { browser } from '@wdio/globals';
import BasePage from './BasePage.js';

const ID = {
    listTitle: 'org.wikipedia:id/item_title',
    articleTitle: 'org.wikipedia:id/page_list_item_title',
    listOnboardingNegative: 'org.wikipedia:id/negativeButton',
    tooltipDismiss: 'org.wikipedia:id/buttonView',
};

export default class ReadingListPage extends BasePage {

    async openList(listName) {
        await browser.dismissIfPresent(this.idSelector(ID.listOnboardingNegative), 2500);
        await this.tap(this.byIdAndText(ID.listTitle, listName));
        await browser.dismissIfPresent(this.idSelector(ID.tooltipDismiss), 3000);
    }

    async hasArticle(title) {
        const entry = this.byIdAndText(ID.articleTitle, title);
        try {
            await entry.waitForDisplayed({ timeout: 10000 });
            return true;
        } catch {
            return false;
        }
    }
}
