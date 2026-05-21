import { driver } from '@wdio/globals';
import BasePage from './BasePage.js';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

// Views > Date Widgets > 1. Dialog
export default class DatePickerDialogPage extends BasePage {

    get displayField()     { return this.byResourceId('io.appium.android.apis:id/dateDisplay'); }
    get changeDateButton() { return this.byText('change the date'); }
    get pickTimeButton()   { return this.byResourceId('io.appium.android.apis:id/pickTime'); }
    get yearHeader()       { return this.byResourceId('android:id/date_picker_header_year'); }
    get dateHeader()       { return this.byResourceId('android:id/date_picker_header_date'); }
    get hoursHeader()      { return this.byResourceId('android:id/hours'); }
    get minutesHeader()    { return this.byResourceId('android:id/minutes'); }

    async open() {
        await this.navigateTo('Views', 'Date Widgets', '1. Dialog');
    }

    async displayedValue() {
        return this.displayField.getText();
    }

    async setDate(day, monthName, year) {
        await this.changeDateButton.click();

        // pick the year first, the year list opens from the header
        await this.yearHeader.click();
        await (await this.scrollToText(String(year))).click();
        await driver.pause(300);

        await this.stepToMonth(monthName);

        await (await this.scrollToText(String(day))).click();
        await (await this.scrollToText('OK')).click();
        await driver.pause(300);
    }

    async setTime(hour, minute) {
        await this.pickTimeButton.click();

        await this.hoursHeader.click();
        await this.byDescription(String(hour)).click();

        await this.minutesHeader.click();
        await this.byDescription(String(minute)).click();

        await (await this.scrollToText('OK')).click();
    }

    // tap Next/Previous month until the calendar reaches the target month
    async stepToMonth(targetMonth) {
        const header = await this.dateHeader.getText();   // e.g. "Mon, Jan 1"
        const currentMonth = header.split(', ')[1].split(' ')[0];
        const diff = MONTHS.indexOf(targetMonth) - MONTHS.indexOf(currentMonth);

        const stepButton = diff > 0 ? 'Next month' : 'Previous month';
        for (let i = 0; i < Math.abs(diff); i++) {
            await this.byAccessibilityId(stepButton).click();
        }
    }
}
