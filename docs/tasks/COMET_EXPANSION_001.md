# COMET_EXPANSION_001 — Comet shop and Deeds

Accepted in development via [PR107](https://github.com/karahaNx/Lumenfall/pull/107),
merge `fe2a7b32859ebe04ecd3382d7b74ef285f683771`, from final head eb478869.
Baseline9f04aca7; branch feature/comet-expansion-001. Main67373faa/APK remain held.

[Mandate](../qa/progression-expansion-001/ORIGINAL_MANDATE.md),
[design/evidence](../qa/comet-expansion-001/README.md),
[interfaces](../qa/comet-expansion-001/IMPLEMENTATION_INTERFACES.md).
Two manual commands and three permanent tracks replace three old purchase rows;
Auto-Ascend remains. Six types cost1380C. Schema2-to-3 preserves paid value,
old Trials/cosmetics, F26, saves/recovery/backup, Deeds and progression.
Transactional purchases/Refresh and bounded claims fix recorded debit/write/
rounding defects. No automatic spending.

Final Full38104034431, Lab38104034440, Forge38104034410, Tree38104034406 and
Comet38104034464 all PASS with raw/deep audits. Full212 attempts/182 IDs/all22
mandatory negatives retained. QA38107699171 preserves six original commands'
standalone stdout on the same head. Actual equal-tree/ordered-parent verification
and13 fresh postmerge checks PASS:843,198 assertions/111 controls. PR107 records
exact hashes, raw evidence publication and limitations; failed originals remain.

Next: [Shared UI](SHARED_UI_001.md), then combined software acceptance.
Native installed-app/WebView60/TalkBack remains open; no release completion.
