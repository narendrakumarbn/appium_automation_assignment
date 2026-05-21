import { expect } from '@wdio/globals';
import allureReporter from '@wdio/allure-reporter';
import DatePickerDialogPage from '../../pageobjects/DatePickerDialogPage.js';
import { attachScreenshot, step } from '../support/allureHelper.js';

describe('Scenario 3 - Date Picker Dialog', () => {
    const dateWidgets = new DatePickerDialogPage();

    beforeEach(async () => {
        allureReporter.addFeature('Date & Time pickers');
        allureReporter.addStory('Scenario 3 - Date Picker Dialog');
        allureReporter.addSeverity('critical');

        await dateWidgets.open();
    });

    it('sets the date to 15 March 2027 and verifies the display', async () => {
        await attachScreenshot('Scenario 3 - "1. Dialog" screen opened');

        const originalDate = await dateWidgets.displayedValue();

        await step('Set the date to 15 March 2027 using the date picker', async () => {
            await dateWidgets.setDate(15, 'March', 2027);
        });

        const updatedDate = await dateWidgets.displayedValue();

        await attachScreenshot('Scenario 3 - date set to 15 March 2027');

        expect(updatedDate).not.toEqual(originalDate);
        expect(updatedDate).toContain('2027');
    });
});

describe('Scenario 3.1 - Time Picker Dialog', () => {
    const dateWidgets = new DatePickerDialogPage();

    beforeEach(async () => {
        allureReporter.addFeature('Date & Time pickers');
        allureReporter.addStory('Scenario 3.1 - Time Picker Dialog');
        allureReporter.addSeverity('normal');

        await dateWidgets.open();
    });

    it('sets the time to 09:30 and verifies the display', async () => {
        await step('Set the time to 09:30 using the time picker', async () => {
            await dateWidgets.setTime(9, 30);
        });

        await attachScreenshot('Scenario 3 - time set to 09:30');

        expect(await dateWidgets.displayedValue()).toContain('09:30');
    });
});
