import BasePage from './BasePage.js';

const ID = 'io.appium.android.apis:id';

// Views > Controls > 1. Light Theme
export default class LightThemeControlsPage extends BasePage {

    get nameField()         { return this.byResourceId(`${ID}/edit`); }
    get agreeCheckbox()     { return this.byResourceId(`${ID}/check1`); }
    get actionButton()      { return this.byResourceId(`${ID}/button`); }
    get firstRadioOption()  { return this.byResourceId(`${ID}/radio1`); }
    get secondRadioOption() { return this.byResourceId(`${ID}/radio2`); }

    async open() {
        await this.navigateTo('Views', 'Controls', '1. Light Theme');
        await this.nameField.waitForDisplayed({ timeout: 10000 });
    }

    async enterName(name) {
        await this.nameField.setValue(name);
    }

    async clearNameField() {
        await this.nameField.clearValue();
    }

    async nameFieldText() {
        return this.nameField.getText();
    }

    async isCheckboxChecked() {
        return (await this.agreeCheckbox.getAttribute('checked')) === 'true';
    }

    async toggleCheckbox() {
        await this.agreeCheckbox.click();
    }

    async tapActionButton() {
        await this.actionButton.click();
    }

    async isActionButtonEnabled() {
        return this.actionButton.isEnabled();
    }

    async selectSecondRadioOption() {
        await this.secondRadioOption.click();
    }

    async isFirstRadioSelected() {
        return (await this.firstRadioOption.getAttribute('checked')) === 'true';
    }

    async isSecondRadioSelected() {
        return (await this.secondRadioOption.getAttribute('checked')) === 'true';
    }
}
