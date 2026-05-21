import { expect } from '@wdio/globals';
import allureReporter from '@wdio/allure-reporter';
import LightThemeControlsPage from '../../pageobjects/LightThemeControlsPage.js';
import { attachScreenshot, step } from '../support/allureHelper.js';

describe('Scenario 1 - Light Theme Controls', () => {
    const controlsScreen = new LightThemeControlsPage();

    beforeEach(async () => {
        allureReporter.addFeature('Controls form');
        allureReporter.addStory('Scenario 1 - Light Theme Controls');
        allureReporter.addSeverity('critical');

        await controlsScreen.open();
    });

    it('accepts text, toggles the checkbox, and changes the radio selection', async () => {
        await step('Enter the name "Narendra"', async () => {
            await controlsScreen.enterName('Narendra');
            expect(await controlsScreen.nameFieldText()).toEqual('Narendra');
        });

        await step('Toggle the checkbox and tap the action button', async () => {
            const checkboxWasChecked = await controlsScreen.isCheckboxChecked();
            await controlsScreen.toggleCheckbox();
            expect(await controlsScreen.isCheckboxChecked()).not.toEqual(checkboxWasChecked);

            await controlsScreen.tapActionButton();
        });

        await attachScreenshot('Scenario 1 - after toggling checkbox and tapping the button');

        await step('Change the radio selection to the second option', async () => {
            await controlsScreen.selectSecondRadioOption();
            expect(await controlsScreen.isSecondRadioSelected()).toBe(true);
            expect(await controlsScreen.isFirstRadioSelected()).toBe(false);
        });
    });

    // negative variant - never enter a name, the text field stays empty
    it('keeps the dependent controls usable when the text field is left empty', async () => {
        const emptyState = await step('Clear the text field so it is empty', async () => {
            await controlsScreen.clearNameField();
            return controlsScreen.nameFieldText();
        });

        await step('Toggle the checkbox and tap the action button (no name entered)', async () => {
            expect(await controlsScreen.isActionButtonEnabled()).toBe(true);

            const checkboxWasChecked = await controlsScreen.isCheckboxChecked();
            await controlsScreen.toggleCheckbox();
            expect(await controlsScreen.isCheckboxChecked()).not.toEqual(checkboxWasChecked);

            await controlsScreen.tapActionButton();
        });

        await attachScreenshot('Scenario 1 (negative) - controls used with an empty text field');

        await step('Change the radio selection to the second option', async () => {
            await controlsScreen.selectSecondRadioOption();
            expect(await controlsScreen.isSecondRadioSelected()).toBe(true);
            expect(await controlsScreen.isFirstRadioSelected()).toBe(false);
        });

        // field should still be empty - the other controls never touched it
        expect(await controlsScreen.nameFieldText()).toEqual(emptyState);
    });
});
