import { expect } from '@wdio/globals';
import allureReporter from '@wdio/allure-reporter';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { step } from '../support/allureSteps.js';
import { captureScreenshot } from '../support/screenshot.js';
import OnboardingPage from '../../pageobjects/OnboardingPage.js';
import HomePage from '../../pageobjects/HomePage.js';
import SearchPage from '../../pageobjects/SearchPage.js';
import ArticlePage from '../../pageobjects/ArticlePage.js';
import ReadingListPage from '../../pageobjects/ReadingListPage.js';

// test input comes from a json fixture so the article can be changed easily
const dataDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data');
const data = JSON.parse(fs.readFileSync(path.join(dataDir, 'article.data.json'), 'utf-8'));

describe('Wikipedia Scenario - save an article', () => {
    const onboarding = new OnboardingPage();
    const home = new HomePage();
    const search = new SearchPage();
    const article = new ArticlePage();
    const readingList = new ReadingListPage();

    it(`searches "${data.searchTerm}", reads the ${data.section} section, and saves it`, async () => {
        allureReporter.addFeature('Reading lists');
        allureReporter.addStory('Save an article to the reading list');
        allureReporter.addSeverity('critical');
        allureReporter.addDescription(
            `Search for "${data.searchTerm}", open the article, scroll to the ` +
            `${data.section} section, save it, and verify it appears in the ` +
            `"${data.readingListName}" reading list.`,
            'text'
        );

        await step('Launch app and skip onboarding', async () => {
            await onboarding.skip();
        });

        await step('Search and open the article', async () => {
            await home.openSearch();
            await search.searchFor(data.searchTerm);
            await search.openResult(data.articleTitle);
        });

        await step(`Open the article and scroll to "${data.section}"`, async () => {
            await article.dismissInterstitials();
            await article.waitUntilLoaded();
            await captureScreenshot('Selenium article page loaded');
            await article.scrollToSection(data.section);
        });

        await step('Save the article to the reading list', async () => {
            const confirmation = await article.saveToReadingList();
            expect(confirmation).toContain(data.articleTitle);
            await captureScreenshot('Article saved to reading list');
        });

        await step('Verify the article is in the reading list', async () => {
            await home.openReadingLists();
            await readingList.openList(data.readingListName);
            expect(await readingList.hasArticle(data.articleTitle)).toBe(true);
        });
    });
});
