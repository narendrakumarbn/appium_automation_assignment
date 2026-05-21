# Wikipedia POM Automation Framework

End-to-end mobile UI automation of the official **Wikipedia Android app**, built
with **WebdriverIO 9 + Appium 3 (UiAutomator2)** using the **Page Object Model**.

The scenario: launch the app, skip onboarding, search for an article, scroll to
a section, save it to the reading list, and verify it was saved.

Running `npm test` executes the full suite **and generates an Allure report**.

---

## Prerequisites

| Requirement | Notes |
|-------------|-------|
| **Node.js 18+** and npm | `node -v` |
| **Java 8+** on `PATH` | Needed by `allure-commandline` to build the report. `java -version` |
| **Android SDK** + an emulator (or real device) | An AVD booted as `emulator-5554` by default |
| **Appium 3** server running on port `4723` | `appium` (with the `uiautomator2` driver installed) |

The app under test (`app/android/wikipedia.apk`) is bundled in the repo and is
installed automatically by Appium — no manual install needed.

---

## Quick start

```bash
# 1. Install dependencies (first time only)
npm install

# 2. Start an Android emulator, then start the Appium server in another terminal
appium

# 3. Run the suite + generate the Allure report
npm test

# 4. Open the Allure report in a browser
npm run allure:open
```

`npm test` runs the suite and, on completion (pass **or** fail), the
`onComplete` hook turns the raw results into an HTML report at `allure-report/`.

---

## npm scripts

| Script | What it does |
|--------|--------------|
| `npm test` | Runs the suite and generates the Allure report (`allure-report/`) |
| `npm run allure:open` | Opens the generated report in a browser |
| `npm run allure:generate` | Re-builds the report from `allure-results/` |
| `npm run allure:report` | Generate **and** open in one step |

---

## Configuration via environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `DEVICE` | `pixel5` | Selects a device profile (`pixel5` = `emulator-5554` / Android 17, `pixel4` = `emulator-5556` / Android 10) |
| `RETRIES` | `1` | How many times a failing spec file is re-run (set `0` while debugging) |

PowerShell:

```powershell
$env:DEVICE='pixel4'; npm test     # run on the other AVD
$env:RETRIES='0';     npm test     # disable retries
```

---

## Project structure

```
wikipedia-pom-framework/
├── app/android/wikipedia.apk        App under test (auto-installed)
├── pageobjects/
│   ├── BasePage.js                  Locator builders + waited actions
│   ├── OnboardingPage.js            First-run carousel
│   ├── HomePage.js                  Explore feed + navigation
│   ├── SearchPage.js                Search box + results
│   ├── ArticlePage.js               Article view + save
│   └── ReadingListPage.js           Saved tab + verification
├── test/
│   ├── specs/wikipedia.spec.js      The scenario (Allure steps + metadata)
│   ├── support/customCommands.js    Custom browser commands (utilities)
│   ├── support/allureSteps.js       step() helper for Allure steps
│   └── data/article.data.json       Externalised test data
├── screenshots/                     Failure screenshots (generated)
├── logs/                            Failure page-source dumps (generated)
├── allure-results/                  Raw Allure data (generated)
├── allure-report/                   Allure HTML report (generated)
├── explanation/                     Day-by-day explanation docs
├── wdio.conf.js                     Runner config + hooks
└── package.json
```

---

## Allure report — what it contains

- **Steps** — each phase of the journey (skip onboarding, search, scroll, save,
  verify) appears as a named step, marked passed or failed.
- **Metadata** — the test is tagged with a *feature* (`Reading lists`),
  *story*, *severity* (`critical`) and a plain-English *description*.
- **Attachments on failure** — the failure screenshot and the full UI hierarchy
  (page source) are attached to the failed test.

---

## Debugging a failure

When a test fails, three artefacts are produced automatically:

1. **`screenshots/FAILED_*.png`** — what the screen looked like at the failure.
2. **`logs/FAILED_*.xml`** — the full UI hierarchy (page source). Open it to see
   the actual `resource-id` / `text` of on-screen elements and fix a broken
   locator.
3. Both are also **attached to the Allure report** against the failed test.

Other techniques:

- **Appium server logs** — the terminal running `appium` prints every command.
  The `printPageSourceOnFindFailure` capability makes Appium dump the UI
  hierarchy into that log whenever an element lookup fails.
- **`browser.debug()`** — drop `await browser.debug();` into a spec or page
  object to freeze the run and open an interactive REPL; inspect elements live,
  then press <kbd>Ctrl</kbd>+<kbd>C</kbd> to continue. Increase the test timeout
  while debugging.
- **Retries** — a flaky spec file is automatically re-run once. Set
  `RETRIES=0` to see the raw first-attempt failure.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Could not generate Allure report` | Install a JRE/JDK and ensure `java` is on `PATH` |
| `Unknown DEVICE "..."` | Use `DEVICE=pixel5` or `DEVICE=pixel4` |
| Connection refused on `4723` | Start the Appium server (`appium`) |
| Device not found | Boot the emulator named in the selected `DEVICE` profile |
