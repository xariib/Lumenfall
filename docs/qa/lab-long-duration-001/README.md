# Long Lab progression and basic Wisp research

[Requirements, implementation and delivery checkpoint](../../tasks/LAB_LONG_DURATION_001.md).

Historical receipts: source SHA256 `5c1bd9c0eed9e687da8cf7d5bb968c8031c622a332afee339551db5c99489356`.
Latest [slot correction/source-bound evidence](../lab-slot-challenges-001/README.md).
Local Node24.20.0, Brave Chromium156.0.8078.74, Windows.
[Core and causal controls](core.json), [native mobile checks](mobile.json).

Fastest full-track bounds assume uninterrupted paid8x, every work-reducing
research already earned, unlimited currencies and only one occupied slot:

| Research | Levels | Minimum at8x |
| --- | ---: | ---: |
| Wisp Damage / Critical Chance / Critical Damage |100 each|365days each|
| Boss Ledger |20|180days|
| Luminous Distillation |20|240days|
| Measured Inquiry / Procurement / Module Fabrication |10 each|90days each|
| Mote Catalysis / Ultimate Analysis |10 each|120days each|
| Field Notes / Rarity Appraisal |10 each|60days each|
| Sigil Cartography |5|30days|
| Focused Apparatus / Resonance Efficiency / Adaptive Growth |5 each|14days each|
| Balanced Curriculum |3|7days|
| Existing foundation research |500 each|about271days each|

These are optimistic lower bounds; actual unlocks, funding, boost gaps, other
occupied slots and the unchanged12h offline productive cap add calendar time.
Other tracks retain their first two short levels. Expanded Apparatus now requires
its progression challenges and15/100days of nominal research for its two ranks.
Already-completed tracks remain completed, and already-paid active/paused work
keeps its old time. This is a deliberate Lumenfall balance, informed by the
user's year-long Tower experience, not a claim that Tower uses these values.

New damage and critical research affects damage rather than Wisp own Power,
Support strength or ability-generated currencies. Critical damage uses the
explicit averaged multiplier1+chance*(criticalFactor-1) in both live and offline
combat. At0 new levels the old combat formulas retain their values.

Reproduce:

```text
node tests/behavioral/lab-longtail.cjs index.html --negative
node tests/behavioral/lab-speed-controls.cjs index.html --longtail --evidence validation-evidence/lab-longtail/mobile
node tests/behavioral/lab-expansion.cjs index.html --negative
node tests/behavioral/lab-expansion-ui.cjs index.html validation-evidence/lab-longtail/original-mobile
node tests/behavioral/offline-catchup.cjs
```

Set `LUMENFALL_QA_CDP_CHROME` to the installed Chromium executable as needed.
Current source-bound receipts are automated checks and self-review. CI,
integration, Android and physical/human pacing acceptance are recorded in the
task as they become available; local checks do not establish those outcomes.
