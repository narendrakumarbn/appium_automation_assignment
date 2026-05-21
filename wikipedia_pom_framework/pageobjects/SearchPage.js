import { browser } from '@wdio/globals';
import BasePage from './BasePage.js';

const ID = {
    searchInput: 'org.wikipedia:id/search_src_text',
};

export default class SearchPage extends BasePage {

    get searchInput() { return this.byId(ID.searchInput); }

    // TextView filter avoids matching the search box, which holds the same text
    resultByTitle(title) {
        return this.byTextView(title);
    }

    async searchFor(term) {
        await this.typeInto(this.searchInput, term);
    }

    async openResult(title) {
        await this.resultByTitle(title).waitForDisplayed({ timeout: 15000 });
        // let the live-search list settle before tapping
        await browser.pause(1500);
        await this.tap(this.resultByTitle(title));
    }
}
