import { browser, driver } from '@wdio/globals';
import BasePage from './BasePage.js';

const ID = {
    searchContainer: 'org.wikipedia:id/search_container',
    readingListsTab: 'org.wikipedia:id/nav_tab_reading_lists',
    announcementNegative: 'org.wikipedia:id/view_announcement_action_negative',
};

export default class HomePage extends BasePage {

    get searchEntry() { return this.byId(ID.searchContainer); }
    get readingTab()  { return this.byId(ID.readingListsTab); }

    async dismissInterstitials() {
        await browser.dismissIfPresent('~Close', 3000);
        await browser.dismissIfPresent(this.idSelector(ID.announcementNegative), 1500);
    }

    async openSearch() {
        await this.dismissInterstitials();
        await this.tap(this.searchEntry);
    }

    // press back until the bottom nav is visible again
    async returnToFeed() {
        for (let attempt = 0; attempt < 6; attempt++) {
            if (await this.readingTab.isDisplayed().catch(() => false)) {
                return;
            }
            await driver.back();
            await browser.pause(1200);
        }
    }

    async openReadingLists() {
        await this.returnToFeed();
        await this.tap(this.readingTab);
    }
}
