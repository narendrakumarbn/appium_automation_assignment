import { $, driver } from '@wdio/globals';

const APP_PACKAGE = 'io.appium.android.apis';
const MENU_TIMEOUT = 10000;

export default class BasePage {

    async restartApp() {
        await driver.terminateApp(APP_PACKAGE);
        await driver.activateApp(APP_PACKAGE);
    }

    // restart and walk down the ApiDemos menu, e.g. navigateTo('Views', 'Controls')
    async navigateTo(...menuLabels) {
        await this.restartApp();
        for (const label of menuLabels) {
            const item = await this.scrollToText(label);
            await item.waitForDisplayed({ timeout: MENU_TIMEOUT });
            await item.click();
        }
    }

    textSelector(text) {
        return `android=new UiSelector().text("${text}")`;
    }

    resourceIdSelector(resourceId) {
        return `android=new UiSelector().resourceId("${resourceId}")`;
    }

    byAccessibilityId(id) {
        return $(`~${id}`);
    }

    byText(text) {
        return $(this.textSelector(text));
    }

    byResourceId(resourceId) {
        return $(this.resourceIdSelector(resourceId));
    }

    byDescription(description) {
        return $(`android=new UiSelector().description("${description}")`);
    }

    scrollToText(text) {
        return $(
            'android=new UiScrollable(new UiSelector().scrollable(true))' +
            `.scrollIntoView(new UiSelector().text("${text}"))`
        );
    }
}
