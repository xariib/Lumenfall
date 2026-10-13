# Exact current workflow command inventory

Source head `768050d7cca586ea724e7ac677804a5ed7d6a3f5`. These are literal run blocks read from Git; this document did not execute them. Existing4 lanes remain unchanged. All9 workflow identities are in inventory.json.

## Pre-merge validation

`.github/workflows/pre-merge-validation.yml` — SHA256 `f0218e6b818970a8bacdf0f43431c89c94b8a7a85343be29b79bc1b99b23e818`.

### APK identity verifier self-test

Source lines 30–30.

```bash
node scripts/verify_apk_identity.cjs --self-test
```

### Node tooling regression checks

Source lines 33–33.

```bash
node tests/tooling/run.cjs
```

### Validate game source

Source lines 37–38.

```bash
node scripts/ci/validate_source.cjs
```

### Stage web assets

Source lines 42–47.

```bash
rm -rf mobile/www
mkdir -p mobile/www/fonts mobile/www/branding
cp index.html mobile/www/index.html
cp -r fonts/. mobile/www/fonts/
cp -r branding/. mobile/www/branding/
```

### Rift cosmetics selection, persistence and mobile acceptance

Source lines 50–50.

```bash
node tests/behavioral/rift-cosmetics.cjs --source mobile/www/index.html --negative
```

### Exact Prism earning numerical and causal regression

Source lines 53–53.

```bash
node tests/behavioral/prism-earning.cjs --source mobile/www/index.html
```

### Development currency UI and retained-value acceptance

Source lines 56–59.

```bash
node scripts/codex/check_context.cjs --task docs/tasks/PRISM_EARNING_001.md
node scripts/codex/check_context.cjs --task docs/tasks/PROGRESSION_EXPANSION_001.md
node tests/behavioral/collection-price-ui.cjs index.html /tmp/lumenfall-collection-price --negative
```

### Stateful behavioral regression suite

Source lines 63–68.

```bash
set -euo pipefail
mkdir -p validation-evidence
git rev-parse HEAD > validation-evidence/commit.txt
sha256sum index.html > validation-evidence/source-sha256.txt
node tests/behavioral/run.cjs --web-root mobile/www --raw-artifacts validation-evidence/raw 2>&1 | tee validation-evidence/behavioral.log
```

### Behavioral harness negative self-test

Source lines 72–83.

```bash
set -euo pipefail
mkdir -p validation-evidence
{
  for scenario in self-test-bad-assertion self-test-uncaught-error self-test-unhandled-rejection self-test-parity-regression self-test-chronology-regression self-test-wisp-formula-regression self-test-wisp-pacing-regression self-test-endgame-currency-regression self-test-wisp-role-regression self-test-p1-05-selected self-test-p1-05-focus-return self-test-lifecycle-duplicate self-test-save-backup-placement self-test-save-backup-confirmation self-test-upgrade-identity-buy self-test-upgrade-identity-value self-test-upgrade-identity-clock self-test-ascend-prisms-tree self-test-ascend-prisms-lab self-test-ascend-prisms-payout self-test-ascend-prisms-repeat self-test-ascend-prisms-rounding; do
    if node tests/behavioral/run.cjs --web-root mobile/www --scenario "$scenario" --raw-artifacts validation-evidence/negative-raw; then
      echo "::error::Behavioral harness negative scenario '$scenario' unexpectedly passed."
      exit 1
    fi
    echo "Behavioral harness correctly caught expected failure: $scenario"
  done
} 2>&1 | tee validation-evidence/negative-self-tests.log
```

### Install runtime error guard in staged copy

Source lines 87–88.

```bash
node scripts/ci/smoke.cjs --install-guard mobile/www/index.html
```

### Browser runtime smoke test

Source lines 92–129.

```bash
set -euo pipefail

CHROME="$(command -v google-chrome || command -v google-chrome-stable || command -v chromium || command -v chromium-browser || true)"
if [ -z "$CHROME" ]; then
  echo "No supported Chromium browser found on the runner."
  exit 1
fi

node scripts/serve.cjs --port 4173 --directory mobile/www >/tmp/lumenfall-http.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" >/dev/null 2>&1 || true' EXIT

ready=0
for _ in $(seq 1 20); do
  if curl --fail --silent http://127.0.0.1:4173/index.html >/dev/null && curl --fail --silent http://127.0.0.1:4173/branding/lumenfall-mark.svg >/dev/null; then
    ready=1
    break
  fi
  sleep 0.25
done
if [ "$ready" -ne 1 ]; then
  cat /tmp/lumenfall-http.log
  exit 1
fi

"$CHROME" \
  --headless=new \
  --no-sandbox \
  --disable-gpu \
  --disable-dev-shm-usage \
  --window-size=390,844 \
  --virtual-time-budget=1800 \
  --dump-dom \
  http://127.0.0.1:4173/index.html \
  >/tmp/lumenfall-dom.html 2>/tmp/lumenfall-chrome.log

node scripts/ci/smoke.cjs --dom /tmp/lumenfall-dom.html --chrome-log /tmp/lumenfall-chrome.log --require-guard
```

## Research Lab expansion validation

`.github/workflows/lab-expansion-validation.yml` — SHA256 `8dd81626af8d3a3c0e3519387060f3015adbbd220ce48d30732555291a3eda02`.

### Exact source identity and task context

Source lines 20–26.

```bash
set -euo pipefail
mkdir -p lab-validation
git rev-parse HEAD > lab-validation/commit.txt
sha256sum index.html > lab-validation/source-sha256.txt
node scripts/ci/validate_source.cjs | tee lab-validation/source.txt
node scripts/codex/check_context.cjs --task docs/tasks/LAB_EXPANSION_001.md | tee lab-validation/context.txt
```

### Complete-game Lab effects purchases save and causal controls

Source lines 28–33.

```bash
set -euo pipefail
node tests/behavioral/lab-expansion.cjs index.html --negative | tee lab-validation/core.json
node tests/behavioral/lab-expansion-boundary.cjs index.html --negative | tee lab-validation/boundary.json
node tests/behavioral/lab-expansion-stress.cjs index.html | tee lab-validation/boundary-stress.json
node tests/behavioral/prism-earning-state.cjs index.html | tee lab-validation/prism-state.json
```

### Actual mobile touch keyboard seven-slot persistence and currency colors

Source lines 36–36.

```bash
node tests/behavioral/lab-expansion-ui.cjs index.html lab-validation/mobile
```

### Execute full product on actual V8 6.0

Source lines 39–48.

```bash
set -euo pipefail
mkdir -p /tmp/lab-node8
cd /tmp/lab-node8
curl -fL --retry 2 https://nodejs.org/dist/v8.3.0/SHASUMS256.txt -o SHASUMS256.txt
curl -fL --retry 2 https://nodejs.org/dist/v8.3.0/node-v8.3.0-linux-x64.tar.xz -o node-v8.3.0-linux-x64.tar.xz
grep ' node-v8.3.0-linux-x64.tar.xz$' SHASUMS256.txt | sha256sum -c -
tar -xf node-v8.3.0-linux-x64.tar.xz
cd "$GITHUB_WORKSPACE"
/tmp/lab-node8/node-v8.3.0-linux-x64/bin/node tests/behavioral/lab-expansion-legacy.cjs index.html | tee lab-validation/v8.json
```

## Rift Forge expansion validation

`.github/workflows/forge-expansion-validation.yml` — SHA256 `a611890e612a80b72e964dd86f228c9fd8a4ef2ff9f99f36333dd2c7c47fb9de`.

### Exact source identity and task context

Source lines 20–26.

```bash
set -euo pipefail
mkdir -p forge-validation
git rev-parse HEAD > forge-validation/commit.txt
sha256sum index.html tests/behavioral/fixtures.json > forge-validation/source-sha256.txt
node scripts/ci/validate_source.cjs | tee forge-validation/source.txt
node scripts/codex/check_context.cjs --task docs/tasks/FORGE_EXPANSION_001.md | tee forge-validation/context.txt
```

### Exact prices real effects transactions Ascends and causal controls

Source lines 28–30.

```bash
set -euo pipefail
node tests/behavioral/forge-expansion.cjs index.html --negative | tee forge-validation/core.json
```

### Authoritative charge calibration and conservative boss bounds

Source lines 32–34.

```bash
set -euo pipefail
node tests/behavioral/forge-expansion-calibration.cjs index.html --negative | tee forge-validation/calibration.json
```

### Eight-hour Auto-Ascend capped windows and frozen offline oracle

Source lines 36–38.

```bash
set -euo pipefail
node tests/behavioral/offline-catchup.cjs --source index.html | tee forge-validation/offline.json
```

### Actual mobile prices input focus and twenty-card acceptance

Source lines 41–41.

```bash
node tests/behavioral/forge-expansion-ui.cjs index.html forge-validation/mobile
```

### Complete product on actual V8 6.0

Source lines 44–53.

```bash
set -euo pipefail
mkdir -p /tmp/forge-node8
cd /tmp/forge-node8
curl -fL --retry 2 https://nodejs.org/dist/v8.3.0/SHASUMS256.txt -o SHASUMS256.txt
curl -fL --retry 2 https://nodejs.org/dist/v8.3.0/node-v8.3.0-linux-x64.tar.xz -o node-v8.3.0-linux-x64.tar.xz
grep ' node-v8.3.0-linux-x64.tar.xz$' SHASUMS256.txt | sha256sum -c -
tar -xf node-v8.3.0-linux-x64.tar.xz
cd "$GITHUB_WORKSPACE"
/tmp/forge-node8/node-v8.3.0-linux-x64/bin/node tests/behavioral/forge-expansion-legacy.cjs index.html | tee forge-validation/v8.json
```

## Ascension Tree focused validation

`.github/workflows/tree-focused-qa.yml` — SHA256 `4d8778abab15f004fdddb8a3580976d131767ef381515b50a6449f81be25e554`.

### Exact source identity and task context

Source lines 24–37.

```bash
set -euo pipefail
mkdir -p tree-validation
git rev-parse HEAD > tree-validation/commit.txt
git rev-parse 'HEAD^{tree}' > tree-validation/tree.txt
git show -s --format=%P HEAD > tree-validation/parents.txt
sha256sum index.html tests/behavioral/fixtures.json > tree-validation/source-sha256.txt
git ls-tree -r HEAD .github/workflows tests/behavioral scripts/ci scripts/lib > tree-validation/source-blobs.txt
node scripts/ci/validate_source.cjs 2>&1 | tee tree-validation/source.txt
node scripts/codex/check_context.cjs --task docs/tasks/TREE_EXPANSION_001.md 2>&1 | tee tree-validation/context.txt
mkdir -p mobile/www/fonts mobile/www/branding
cp index.html mobile/www/index.html
cp -r fonts/. mobile/www/fonts/
cp -r branding/. mobile/www/branding/
```

### Tree prices real effects purchases saves and causal controls

Source lines 41–43.

```bash
set -euo pipefail
node tests/behavioral/tree-expansion-core.cjs index.html --negative 2>&1 | tee tree-validation/core.json
```

### Tree offline chronology and Auto-Ascend preservation

Source lines 45–47.

```bash
set -euo pipefail
node tests/behavioral/tree-expansion-offline.cjs index.html --negative 2>&1 | tee tree-validation/offline.json
```

### Tree independent investment and earned-benefit economy

Source lines 49–51.

```bash
set -euo pipefail
node tests/behavioral/tree-expansion-economy.cjs index.html --negative 2>&1 | tee tree-validation/economy.json
```

### Swift actual purchase ROI and independent Prism matrix

Source lines 53–56.

```bash
set -euo pipefail
node tests/behavioral/prism-earning-state.cjs index.html 2>&1 | tee tree-validation/prism-state.json
node tests/behavioral/prism-closeout-data.cjs index.html tree-validation/prism 2>&1 | tee tree-validation/prism-economy-summary.json
```

### Actual browser Prism payouts persistence and causal failures

Source lines 58–60.

```bash
set -euo pipefail
node tests/behavioral/prism-earning-focused.cjs mobile/www tree-validation/prism/browser 2>&1 | tee tree-validation/prism-browser.log
```

### Actual Tree mobile input focus prices and all tracks

Source lines 63–65.

```bash
set -euo pipefail
node tests/behavioral/tree-expansion-mobile.cjs index.html tree-validation/mobile 2>&1 | tee tree-validation/mobile.log
```

### Prism mobile payout and Auto-Ascend UI acceptance

Source lines 68–70.

```bash
set -euo pipefail
node tests/behavioral/prism-acceptance.cjs index.html tree-validation/prism/mobile 2>&1 | tee tree-validation/prism-mobile.log
```

### Complete Tree and Prism execution on actual V8 6.0

Source lines 73–83.

```bash
set -euo pipefail
mkdir -p /tmp/tree-node8
cd /tmp/tree-node8
curl -fL --retry 2 https://nodejs.org/dist/v8.3.0/SHASUMS256.txt -o SHASUMS256.txt
curl -fL --retry 2 https://nodejs.org/dist/v8.3.0/node-v8.3.0-linux-x64.tar.xz -o node-v8.3.0-linux-x64.tar.xz
grep ' node-v8.3.0-linux-x64.tar.xz$' SHASUMS256.txt | sha256sum -c -
tar -xf node-v8.3.0-linux-x64.tar.xz
cd "$GITHUB_WORKSPACE"
/tmp/tree-node8/node-v8.3.0-linux-x64/bin/node tests/behavioral/tree-expansion-v8.cjs index.html 2>&1 | tee tree-validation/v8.json
/tmp/tree-node8/node-v8.3.0-linux-x64/bin/node tests/behavioral/prism-legacy-runtime.cjs index.html tree-validation/prism/legacy-cases.json 2>&1 | tee tree-validation/prism-v8.json
```

## Fifth lane: new Comet-focused validation

**Not present at this head; no executable filename or command has been assigned.** It is additional to the four literal workflows above. The following is the required interface/coverage plan, not a claim that new tests already exist or pass.

| Stage | Required future command contract |
| --- | --- |
| Identity and source | Record actual head/synthetic merge/ordered parents/tree/source/fixture/test blobs; run existing source/context validation against the new Comet task when created. |
| Core and independent economy | New focused Node20+ runner on actual index.html, with mandatory causal negatives, all6active IDs, old3paidledger, original23Deeds and4actual event Deeds, exact debit/credit and cap/unlock rules. |
| Strict persistence | Actual0/1/2→3 migration; strictcurrent3 invalid-block errors; preserved rawprimary/blocked saving; backup/recovery/reload/restore/failedprimary/committed-recovery fault endpoints; exact one-pass claim order and no replay. |
| Chronology | Actual live/split/yielded offline and Farm batches, realkill work, boundedbank/fullbank, allAutoAscend boundaries, same-run token, no automatic commands, old paid entitlement continuations. |
| Browser |12real profiles320/390/430 × rootfont1/2 × motion; actual native input/purchase/action, separate currency color, last-row focus/scroll, stable AA and old Trial/cosmetic controls; raw screenshots and process/error outcomes. |
| Legacy runtime | Actual completeIIFE on official checksum-verifiedNode8.3/V86.0 with a compatible driver; raw output and exact source/test identities. |
| Artifact | Always preserve source-bound raw receipts, failures, screenshots and test identities, without treating skipped steps as acceptance. |

The filename/CLI choices must be assigned when the feature begins. Do not claim a fifth executable command on this pre-implementation snapshot. Existing commands, scenario IDs and mandatory negative hooks are protected independently. No APK build or release is part of this plan.
