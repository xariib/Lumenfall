# Readable offline return summary

29 October 2026, Node24.20.0 / Windows, installed Brave Chromium156.0.8078.74.
Source SHA-256: `8b06aa4afde553ee9c582a73c5aee7f5514a77423c6521ab5831620d9f52f026`.

[Task and delivery status](../../tasks/OFFLINE_RECAP_CLARITY_001.md).
[Core receipt checks](core.json), [mobile geometry/input receipt](mobile.json).

Previews: [short return](short-390.png), [long return with collapsed Lab
results](long-collapsed-390.png), [expanded Lab at 320px / 200% text](expanded-320-2.png).
All names remain available; repeated study completions show a level total.
The fixed footer keeps Continue visible while the result body scrolls.

Reproduce from repository root:

```text
node tests/behavioral/offline-recap-clarity.cjs index.html
node tests/behavioral/offline-recap-clarity-mobile.cjs validation-evidence/offline-recap-clarity/mobile
```

Set `LUMENFALL_QA_CDP_CHROME` to an installed Chromium executable when needed.
The mobile driver uses production DOM/CSS and return handlers with fixed receipt
fixtures and clocks. Existing offline-catchup-ui separately verifies actual
simulation and committed saves. Self-review/automated checks only; screenshots
and modern Chromium do not establish physical phone, WebView60 or TalkBack acceptance.
