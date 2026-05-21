import { expect } from '@wdio/globals';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import LightThemeControlsPage from '../../pageobjects/LightThemeControlsPage.js';

// load the input values from the json fixture
const thisDir = path.dirname(fileURLToPath(import.meta.url));
const fixturePath = path.join(thisDir, '..', 'data', 'controls.data.json');
const dataSets = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));

describe('Scenario 1 (data-driven) - Light Theme Controls', () => {
    const controlsScreen = new LightThemeControlsPage();

    // run the same flow once per data set
    for (const data of dataSets) {
        describe(`data set: ${data.label}`, () => {

            beforeEach(async () => {
                await controlsScreen.open();
            });

            it(`accepts "${data.name}", toggles the checkbox, and changes the radio selection`, async () => {
                await controlsScreen.enterName(data.name);
                expect(await controlsScreen.nameFieldText()).toEqual(data.name);

                const checkboxWasChecked = await controlsScreen.isCheckboxChecked();
                await controlsScreen.toggleCheckbox();
                expect(await controlsScreen.isCheckboxChecked()).not.toEqual(checkboxWasChecked);

                await controlsScreen.tapActionButton();

                await controlsScreen.selectSecondRadioOption();
                expect(await controlsScreen.isSecondRadioSelected()).toBe(true);
                expect(await controlsScreen.isFirstRadioSelected()).toBe(false);
            });
        });
    }
});
