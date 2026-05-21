import { expect } from '@wdio/globals';
import allureReporter from '@wdio/allure-reporter';
import ExpandableListPage from '../../pageobjects/ExpandableListPage.js';
import { attachScreenshot, step } from '../support/allureHelper.js';

// exercises the custom command browser.longPressElement(selector, duration)
describe('Scenario 4 - Long Press Element', () => {
    const expandableList = new ExpandableListPage();

    beforeEach(async () => {
        allureReporter.addFeature('Custom commands');
        allureReporter.addStory('browser.longPressElement(selector, duration)');
        allureReporter.addSeverity('normal');

        await expandableList.open();
    });

    it('long-presses a list group and opens its context menu', async () => {
        await step('Long-press the "People Names" group for 1500 ms', async () => {
            await expandableList.longPressGroup('People Names', 1500);
        });

        expect(await expandableList.isContextMenuShown()).toBe(true);

        await attachScreenshot('longPressElement - context menu open after long press');

        await step('Close the context menu', async () => {
            await expandableList.closeContextMenu();
        });

        expect(await expandableList.isContextMenuShown()).toBe(false);
    });
});
