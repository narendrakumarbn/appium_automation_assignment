import { browser } from '@wdio/globals';
import BasePage from './BasePage.js';

const ID = {
    webView: 'org.wikipedia:id/page_web_view',
    saveButton: 'org.wikipedia:id/page_save',
    snackbarText: 'org.wikipedia:id/snackbar_text',
    gamesDialogClose: 'org.wikipedia:id/closeButton',
    tooltipDismiss: 'org.wikipedia:id/buttonView',
};

export default class ArticlePage extends BasePage {

    get webView()    { return this.byId(ID.webView); }
    get saveButton() { return this.byId(ID.saveButton); }
    get snackbar()   { return this.byId(ID.snackbarText); }

    // the Save button is a more reliable readiness signal than the WebView
    async waitUntilLoaded() {
        await this.waitForVisible(this.saveButton, 25000);
    }

    async dismissInterstitials() {
        await browser.dismissIfPresent(this.idSelector(ID.gamesDialogClose), 6000);
        await browser.dismissIfPresent(this.idSelector(ID.tooltipDismiss), 2000);
    }

    async scrollToSection(sectionTitle) {
        await browser.scrollUntilVisible(this.textViewSelector(sectionTitle), 30);
    }

    async saveToReadingList() {
        await this.tap(this.saveButton);
        await this.waitForVisible(this.snackbar, 10000);
        return this.snackbar.getText();
    }
}
