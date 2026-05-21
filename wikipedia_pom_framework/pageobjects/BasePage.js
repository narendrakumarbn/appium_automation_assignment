import { $ } from '@wdio/globals';

export default class BasePage {

    idSelector(id) {
        return `android=new UiSelector().resourceId("${id}")`;
    }

    textSelector(text) {
        return `android=new UiSelector().text("${text}")`;
    }

    textViewSelector(text) {
        return `android=new UiSelector().className("android.widget.TextView").text("${text}")`;
    }

    idAndTextSelector(id, text) {
        return `android=new UiSelector().resourceId("${id}").text("${text}")`;
    }

    byId(id)              { return $(this.idSelector(id)); }
    byText(text)          { return $(this.textSelector(text)); }
    byTextView(text)      { return $(this.textViewSelector(text)); }
    byIdAndText(id, text) { return $(this.idAndTextSelector(id, text)); }
    byAccessibilityId(id) { return $(`~${id}`); }

    async waitForVisible(element, timeout = 15000) {
        await element.waitForDisplayed({ timeout });
        return element;
    }

    async tap(element, timeout = 15000) {
        await this.waitForVisible(element, timeout);
        await element.click();
    }

    async typeInto(element, text, timeout = 15000) {
        await this.waitForVisible(element, timeout);
        await element.setValue(text);
    }
}
