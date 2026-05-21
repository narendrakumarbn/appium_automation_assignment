import { browser } from '@wdio/globals';
import BasePage from './BasePage.js';

// Views > Expandable Lists > 1. Custom Adapter
// long-pressing a group row opens its context menu ("Sample action")
export default class ExpandableListPage extends BasePage {

    async open() {
        await this.navigateTo('Views', 'Expandable Lists', '1. Custom Adapter');
        await this.byText('People Names').waitForDisplayed({ timeout: 10000 });
    }

    async longPressGroup(groupName, duration = 1500) {
        await browser.longPressElement(this.textSelector(groupName), duration);
    }

    contextMenuAction() {
        return this.byText('Sample action');
    }

    async isContextMenuShown() {
        return this.contextMenuAction().isDisplayed();
    }

    async closeContextMenu() {
        await browser.back();
        await this.contextMenuAction().waitForDisplayed({
            timeout: 10000,
            reverse: true,
        });
    }
}
