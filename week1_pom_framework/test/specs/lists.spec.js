import { expect } from '@wdio/globals';
import allureReporter from '@wdio/allure-reporter';
import ArrayListPage from '../../pageobjects/ArrayListPage.js';
import { attachScreenshot, step } from '../support/allureHelper.js';

describe('Scenario 2 - Scroll and Select', () => {
    const arrayList = new ArrayListPage();

    beforeEach(async () => {
        allureReporter.addFeature('Scrollable list');
        allureReporter.addStory('Scenario 2 - Scroll and Select');
        allureReporter.addSeverity('critical');

        await arrayList.open();
    });

    it('scrolls down to Finn and selects it', async () => {
        // scroll until "Finn" is visible but don't tap it yet
        const finn = await step('Scroll down the list until "Finn" is visible', async () => {
            return arrayList.scrollToItem('Finn');
        });

        await attachScreenshot('Scenario 2 - "Finn" visible, before clicking');

        await step('Select "Finn"', async () => {
            await finn.click();
        });

        expect(await arrayList.isItemVisible('Finn')).toBe(true);
    });

    it('scrolls back to the top and confirms the first item is visible', async () => {
        await arrayList.scrollToItem('Finn');
        await arrayList.scrollToTop();
        expect(await arrayList.firstItemText()).toEqual('Abbaye de Belloc');
    });
});
