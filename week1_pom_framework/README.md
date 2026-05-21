# ApiDemos Mobile Automation — POM Framework with Allure Reporting

A WebdriverIO + Appium automation framework for the Android **ApiDemos** app,
built on the **Page Object Model (POM)**. Selectors live entirely in page
objects; the specs read as plain English. Every run produces a self-contained
**Allure HTML report** with screenshots, steps, and metadata.

---

## 1. Prerequisites

Install these once on the machine that will run the suite:

| Tool | Why it is needed | Check it works |
|------|------------------|----------------|
| **Node.js 18+** | Runs WebdriverIO | `node -v` |
| **Java 8+** (JDK) | Allure uses it to build the HTML report | `java -version` |
| **Android SDK + an emulator/device** | The app under test runs here | `adb devices` |
| **Appium Server 2.x** | Bridges WebdriverIO and the device | `appium -v` |
| **UiAutomator2 driver** | Appium driver for Android | `appium driver list --installed` |

> The app itself (`ApiDemos-release.apk`) ships **inside this repo** at
> `app/android/` — you do not need to download or install it manually.

---

## 2. Clone & install

```bash
git clone <repository-url>
cd pom-framework
npm install
```

`npm install` pulls every dependency listed in `package.json`, including
WebdriverIO, the Appium service, the Allure reporter, and `allure-commandline`.

---

## 3. Start the device and Appium

In two separate terminals:

```bash
# Terminal 1 — start an Android emulator (or plug in a real device)
emulator -avd <your_avd_name>
adb devices            # confirm the device shows as "device"

# Terminal 2 — start the Appium server on the default port 4723
appium
```

The default device profile expects an emulator named **`emulator-5554`** on
Android API level **17**. To target a different AVD, see *Section 7*.

---

## 4. Run the suite

```bash
npm test
```

This single command:

1. Clears any previous Allure data.
2. Runs **all spec files** in `test/specs/` against the device.
3. Captures screenshots at the points each scenario requires.
4. Captures a **failure screenshot** automatically for any test that fails.
5. Generates a self-contained Allure report at **`allure-report/index.html`**.

Run a single scenario instead of the whole suite:

```bash
npx wdio run wdio.conf.js --spec test/specs/lists.spec.js
```

---

## 5. View the Allure report

After `npm test` finishes, the report is one standalone HTML file —
just open it in any browser:

```
allure-report/index.html
```

Convenience script (Windows):

```bash
npm run report:open
```

The report is generated with `--single-file`, so every screenshot is embedded
— you can email or zip the one `index.html` and it still works, no server
needed.

### What the report contains

- **Suites & scenarios** — each `describe` / `it` as a pass/fail tree.
- **Steps** — meaningful named steps (e.g. *"Set the date to 15 March 2027"*).
- **Screenshots** — attached at the points described in *Section 6*.
- **Metadata** — each scenario is tagged with a Feature, Story, and Severity.
- **Timeline & retries** — duration of each test and any retry attempts.

---

## 6. Screenshots in the report

Screenshots are attached to the Allure report in two ways.

### On failure (automatic)

The `afterTest` hook in `wdio.conf.js` detects a failed test, captures the
screen at the moment of failure, and attaches it as
`FAILED - <test name>`. Nothing needs to be added to a spec for this.

### On success (explicit, per requirement)

Three scenarios capture a screenshot at a specific point of a **passing** run,
via the `attachScreenshot()` helper in `test/support/allureHelper.js`:

| Scenario | When the screenshot is taken |
|----------|------------------------------|
| **Scenario 1 — Controls** | *After* toggling the checkbox and tapping the action button |
| **Scenario 2 — Scroll list** | *Before* clicking, with **"Finn"** scrolled into view |
| **Scenario 3 — Date/Time picker** | (1) when the **"1. Dialog"** screen opens, (2) *after* the date is set to **15 March 2027**, (3) when the time is set to **09:30** |

---

## 7. Choosing a target device

The whole suite can run against a different AVD by setting **one** environment
variable, `DEVICE`. Each profile bundles the `deviceName` + `platformVersion`
that belong together.

```bash
# default profile (pixel5)
npm test

# PowerShell
$env:DEVICE='pixel4'; npm test

# bash / CMD
DEVICE=pixel4 npm test
```

Profiles are defined in `wdio.conf.js` — add or edit entries in
`deviceProfiles` to support more devices.

---

## 8. Retry logic for flaky tests

Mobile UI tests are occasionally flaky (an emulator hiccup, a slow render).
Two layers of retry, configured in `wdio.conf.js`, keep a flaky failure from
breaking the run:

- **`mochaOpts.retries: 1`** — a failed individual test is re-run once. If the
  retry passes, the test is reported as **passed**.
- **`specFileRetries: 1`** — if a whole spec file crashes (e.g. a lost Appium
  session), that file is re-run once before being declared failed.

Both retries are visible in the Allure report's *Retries* tab, so flakiness is
recorded rather than hidden.

---

## 9. Debugging tips

When a test fails or behaves unexpectedly:

- **Read the Appium server logs** — the terminal running `appium` prints every
  command, the selector used, and the raw error. The line just before a
  failure usually names the element that could not be found.
- **Open the failure screenshot** in the Allure report — it shows the exact
  screen state at the moment the assertion broke.
- **Pause and inspect interactively** — drop `await browser.debug()` into a
  spec. The runner halts, and you can inspect elements live from the REPL
  (`await $('~id').isDisplayed()`). Press `Ctrl+C` to resume.
- **Slow a step down** — `await browser.pause(3000)` gives you time to watch
  the screen, useful while developing a new selector.
- **Inspect the UI tree** — `adb shell uiautomator dump` plus
  `adb pull /sdcard/window_dump.xml` exports the live view hierarchy with every
  resource-id, text, and content-desc.

---

## 10. Project structure

```
pom-framework/
├── app/android/ApiDemos-release.apk    App under test (bundled)
├── pageobjects/
│   ├── BasePage.js                     App lifecycle, menu navigation, locators
│   ├── LightThemeControlsPage.js       Views > Controls > 1. Light Theme
│   ├── ArrayListPage.js                Views > Lists > 01. Array
│   ├── DatePickerDialogPage.js         Views > Date Widgets > 1. Dialog
│   └── ExpandableListPage.js           Views > Expandable Lists > 1. Custom Adapter
├── test/
│   ├── specs/
│   │   ├── controls.spec.js            Scenario 1
│   │   ├── controls.data.spec.js       Scenario 1 (data-driven)
│   │   ├── lists.spec.js               Scenario 2
│   │   ├── datepicker.spec.js          Scenario 3 + bonus time picker
│   │   └── longpress.spec.js           Custom-command demo
│   ├── data/controls.data.json         Fixture for the data-driven spec
│   └── support/
│       ├── customCommands.js           browser.scrollUntilVisible / longPressElement
│       └── allureHelper.js             attachScreenshot() / step() helpers
├── explanation/                        Day-by-day write-ups (HTML)
├── wdio.conf.js                        WebdriverIO config — reporters, hooks, retries
├── package.json
└── README.md
```

### How the layers fit together

- **`BasePage`** — every page extends it. Restarts the app, walks the ApiDemos
  menu (`navigateTo('Views', 'Controls', ...)`), and owns the locator builders.
  Raw selector strings appear **only** here.
- **Page objects** — one class per screen, exposing intention-revealing methods
  (`enterName`, `toggleCheckbox`, `setDate`) and an `open()`.
- **Specs** — describe *what* a scenario does, never *how*. They call page
  methods and the `allureHelper` helpers; they never touch a selector.

---

## 11. Scenarios covered

| Spec | Scenario |
|------|----------|
| `controls.spec.js` | **1** — Enter text, toggle the checkbox, tap the button, change the radio |
| `controls.data.spec.js` | **1 (data-driven)** — the same flow run once per row in a JSON fixture |
| `lists.spec.js` | **2** — Scroll a long list until "Finn" is visible, select it, scroll back to top |
| `datepicker.spec.js` | **3** — Set the date to 15 March 2027; **bonus** — set the time to 09:30 |
| `longpress.spec.js` | Demonstrates the custom `browser.longPressElement` command |

---

## 12. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Could not connect to Appium` | Make sure `appium` is running on port 4723. |
| `Unknown DEVICE "..."` | Use a profile defined in `deviceProfiles` (`pixel5`, `pixel4`). |
| Allure report not generated | Confirm `java -version` works — Allure needs a JDK. |
| Tests cannot find elements | Confirm the emulator matches the `DEVICE` profile's API level. |
| `allure-report` looks stale | It is rebuilt every `npm test`; re-run the suite. |
