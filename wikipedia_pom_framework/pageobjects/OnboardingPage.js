import { browser } from '@wdio/globals';
import BasePage from './BasePage.js';

const ID = {
    skipButton: 'org.wikipedia:id/fragment_onboarding_skip_button',
};

export default class OnboardingPage extends BasePage {

    // does nothing if the carousel isn't shown
    async skip() {
        return browser.dismissIfPresent(this.idSelector(ID.skipButton), 20000);
    }
}
