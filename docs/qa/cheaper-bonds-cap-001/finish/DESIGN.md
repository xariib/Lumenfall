# F21 implementation and save/value review

Self-review of this feature only; no independent Core/QA approval claimed.
Current rules supersede old role-approval stages.

## Targeted implementation and value policy

- Display **Cheaper Recruitment**, keep persisted ID `bonds`. Explain recruiting
  and Empower discount accurately: +3 percentage points per level, maximum60%,
  minimum40% of normal price, cap20. Existing integer recruiting rounding remains.
- Canonical catalog metadata guards direct/stale/repeated calls before mutation,
  payment or save. UI shows Maxed and effective20/20, with raw history separately.
  Tree has no bulk/Max/queue/automation buyer. Existing achievement behavior for
  other nodes is outside F21; Echo/Formation/Tree-exclusive work stays separate.
- Original prices remain:19→20 costs2329, total through20 costs7507.
- Full one-time restitution in original Prisms for levels above20:
  `sum(ceil(2 * 1.45^k), k=20..raw-1)`. Level21:3376; level40:12655538.
  The103-commit price history is preserved in the historical archive. PR67's
  recorded user-approved original-currency policy agrees with this choice.
- Raw levels remain. Finite original prices are returned; levels beyond the
  first nonfinite/unpayable old price remain recorded as unpriced history.
  No guessed refund percentage, replacement effect, amount cap or BigInt product
  dependency is added. Exact original Number prices define the restitution.
- Exact TwoSum detection checks both operands. A refund that cannot be added
  without loss/overflow remains a same-currency credit, never silently truncated.
  Tree payments consume credits only when both subtractions are exact; otherwise
  those credits remain available for a representable payment. Wallet debits also require exact subtraction. Prices remain unchanged;
  an unrepresentable debit is refused instead of charging a rounded/free amount. QA uses BigInt as an independent oracle.
- Wallet, remaining credits and versioned receipt share the same canonical
  snapshot. Existing save/restore transactions persist them together. Repeated
  normalization/reload/recovery/restore is idempotent. Restore replaces the whole
  normalized snapshot; it never adds the old refund to the current wallet.
  Partial/orphan receipts reject for recovery instead of silently recrediting.
- Generic receipt/credit history from other features is retained. Schema remains
  additive v1. Unsupported/newer markers fail safely. Old-APK downgrade that
  strips additive receipts is not supported; use new-APK backups for restoration.
- Paid Lab snapshots, other currencies, chronology/offline and permanent
  ownership survive. No prices/effects/caps outside F21, signing/assets/package,
  unrelated tools or historical originals are changed.


## PR89 review corrections

P1: actual raw95 restitution could create a wallet above integer precision. New refunds above the safe
integer range now stay as spendable credits; existing wallets are retained. All
Tree payments now check exact wallet subtraction as well as both credit
subtractions; representable payments still use the unchanged price. Regression
covers refusal/no save for1 Prism and a real exact2-Prism debit.

P2: every receipt amount now matches the original rounded price schedule, not
only its sign/count. Exact cross-engine equality would reject valid data:
Node8/V8 6.0 and Node24 differ at1822 finite prices, by up to494 ULPs. The
exponent-scaled relative rounding envelope k*EPSILON/(1-k*EPSILON) is applied
before ceil. Small prices (including3376) require the exact integer. Stored
amounts are retained byte-for-number; validation never reprices or recredits.
Full finite price arrays pass in both engine directions; [1], [3375], [3377]
receipts reject for recovery. This numeric envelope changes no gameplay prices.

Further P2 corrections: the40% floor/60% cap is now explicitly before existing
whole-Lumen rounding (e.g. normal Ember2 costs13, discounted costs5). No price
changes. The finite original schedule and cross-engine bounds are cached once,
limited by the first nonfinite price. Completed receipts no longer rebuild a
refund array or repeat exponentiation; every persisted amount is still validated.
The redundant second receipt/history clone is removed.100 raw2000 canonical
boundaries perform zero repeated price calculations; corrupting a completed
receipt afterwards still rejects. A causal uncached-price mutation detects the
performance regression. The cache never contains player data or exposes arrays
to saved state.

Main91decbc (PR78/85) integration retains Forge memory, the common12-hour cap,
save schema2 and retired Reserves guard. F21 record version remains1 within the
schema2 save. Legacy fixtures explicitly start at schema1; v0, both old-currency
refunds, both receipts and the pre-existing F21 receipt through schema2 transition
are checked. Five added checks pass; existing full offline catch-up16 records
pass with both exact additive F21 defaults and all upstream F26 assertions.

PR89 P2 credit-record correction: every Prism credit requires a plain record,
nonempty string ID and finite positive integer amount. Own credits also require
the valid own receipt. Null/malformed/fractional entries reject for recovery;
valid foreign integer credits remain. Nine malformed cases, actual null/0.5
primary recovery and the V8 6.0 probe pass; a credit-record defect control detects
removal of validation. No legitimate price, credit or currency is rounded.

Main14d5f3a (Rift guidance and Formation delivery) merges cleanly. Current533
focused assertions,10 causal controls,926 clarity and V8 6.0 pass on the combined
source. The earlier full offline16-record check used c54856a source before the
credit-record/Rift changes; final required full CI verifies the current bytes.

Mainac0d28e includes PR66 Tree identity/cap/UI and PR95/96 acceptance records.
Its getNodeBuyPlan remains the shared handler/UI planner, preserving actual
catalog-object identity, unlock/retired nodes, finite cost, increment and Echo6
guards. Exact Prism wallet/credit payment is added to that plan; all buys use
its canonical level and payment. QA resolves real catalog nodes, separately
checks forged-object refusal, and retains all original Tree state assertions
with the explicit additive F21 history expectation. Current534 focused checks,
10 causal controls,155 Tree contract checks,693 Tree mobile checks,926 clarity
and V8 6.0 pass on81fcc461 source. Full required176-scenario CI remains pending.

PR89 automated P2 (review70e6f82) correctly identified repeated cloning/scanning
of large F21 records at each simulated Ascend. The private internal simulation
now calls the same gameplay normalizer while retaining untouched, already
canonical F21 record references. This path cannot import saves; every load,
backup restore/export and persisted save still fully validates all records.
Schema2 and all other gameplay/offline-refund normalization stay in force.
Actual14400 raw2000 auto-Ascends take323ms locally, perform zero F21 record
normalizations, preserve identity/exact values and match full normalization.
A specific ascend-copy mutation restores the slow path and is caught. Existing
chronology live/offline/split passes on0e93a8e9 source. Timing is local evidence,
not a physical-device performance claim.

Main06b28d5 Rift cosmetic implementation merges cleanly, preserving its source
and required gate. Focused538 checks including14400 actual Ascends pass on
combined2e691820 source. Earlier individual controls/chronology/offline results
record0e93a8e9; final required CI checks the combined bytes and all gates.

PR89 automated P2 (reviewef51ba8) identified unsupported migration versions
accepted below the cap. Version validation now precedes every early return,
without rewriting future history.15 direct checks cover raw0/20/21 and malformed
versions, missing legacy markers remain compatible, V8 6.0 rejects them, and an
actual unsupported-version primary falls back to the intact recovery slot. A
version-check mutation is caught.553 focused assertions/26 result groups pass.

CI37755569019 failed in the newly integrated Rift cosmetic gate before any
assertion:Target.createTarget timeout. Full failure log retained. Unmodified
Rift168 samples and F21 Node20 checks pass locally on38594553. Its gate now
records resolved browser/protocol identity and stderr, waits for the browser
version handshake and allows30s protocol startup. Assertions are unchanged;
this scoped delivery fix diagnoses/handles cold browser startup without skipping
the new required gate. Native input/product bytes remain unchanged.

Main3f1b6fa integrates Lab UI, upgrade descriptions and loadout acceptance.
Their product changes merge without conflicts; all553 F21 assertions pass on
175f7013 combined source. CI37756169423 passed all gates on the preceding
source; required CI is rerun for this final main combination. No assertion or
upstream gate is removed. The growing shared startup requires a shorter F21
task index; the complete decisions, requirements and raw evidence stay linked.

PR89 P2 (reviewb060ed42):own refund credits now reconcile exactly with the
receipt.remainingCredits sequence, protected by own/root audit-version markers.
Creation and each actual credit debit update both records in the same canonical
save; deletion, duplication, altered positive amounts, reordering, missing audit
and unsupported versions reject for recovery. Four actual damaged-primary cases
recover the exact intact wallet/credit/receipt. A credit-reconcile control catches
removal of this validation.13 controls,567 assertions/30 groups and V8 6.0 pass.
Old additive candidate records with no audit marker adopt their known remaining
credits once, preserving wallet/original prices/value without issuing refunds.
Untracked historical losses cannot be inferred; this limitation is explicit.
New audit markers prevent missing receipt audit fields being mistaken for that
legacy format. Foreign records remain intact; save schema2/global F21 version1
remain compatible. The private14,400-Ascend path retains these validated records
without extra per-boundary scans. QA spent-credit fixtures now include a coherent
zero remaining-credit record; new damage tests separately verify removal rejects.

## Deterministic first restitution and final recovery/payment fixes

Current source: `0dcce970cdd19aa2ee8a37f4c3f36a47d1c30998ba0f908cef608aafc0be0fd0`; combined main `67373fa`. Earlier evidence above retains its original versions.

[Focused report](review-followup-candidate.json):575 assertions (389 gameplay/186 refund),31 result groups including two new actual primary-slot recoveries, all twelve mobile profiles PASS. [V8 6](review-followup-v8.json) PASS; [existing Tree](review-followup-tree.txt):161 assertions PASS using the documented local transport adapter. [Negative controls](review-followup-negatives.json):17 intended failures/clean teardown,15 required in CI. Source validation and actual task context check PASS.

Completed receipts below/equal20 reject before a real purchase. A versioned completed record with its entire receipt deleted recovers instead of refunding again. Large original credits contribute their largest exact whole-ULP portion before the wallet pays the balance:original level98 credit13034495146592222 plus wallet1 pays Swift3 exactly. First refunds use a fixed1889-price schedule from the per-level maximum of the checked-in original V8 6 and modern observations; SHA256 of its JSON array is `5bcb799239e321434384d45f79cdf39e2bfa8487e729b5313bd4c29d6cb56ee5`. Existing valid receipts preserve their amounts and never refund again. The level87 first-refund total is identically486220959842305; level21/40 remain3376/12655538.

CI37762509921 passed head6891310 before newer main/review fixes. Fresh combined CI, integration, signed APK and native acceptance remain pending. The emulator described earlier is historical preparation; its live availability must be rechecked after the environment restart. No final Android acceptance is claimed.

## Power-spacing and CI fixture correction

Source46323fdd0cbc0266182c36d4c5db32eca95e5362481f183171cb4c0fc6e5dfa5:[focused report](power-spacing-candidate.json)577 assertions/31 groups PASS; [V8 6](power-spacing-v8.json) PASS. At an exact power of two, the smaller downward ULP is used for partial credit debits; credit18014398509481984 plus wallet1 pays Swift3 with exact conservation. [Causal control](power-spacing-negative.json) removes only that correction and fails the intended payment assertion. CI now requires16 controls;17 prior controls retain their previous hashes.

CI38173323460 failed the existing upgrade-identity-contracts scenario:its synthetic legacy31 ownership retained a fresh completed-audit marker. Local full-suite reproduction identified the exact refusal; the fixture now explicitly removes only that new marker for above20 original ownership. All existing assertions remain. [Targeted rerun](upgrade-identity-legacy-fixture.txt) PASS. Full combined CI/integration/APK/device acceptance remain pending.

## Final exact allocation review fix

Source `eebd7a26e1b75dc3019e7ca4f2b66da6cfc04cf6d21676ac5de103bf48fb72eb`: [focused report](allocation-candidate.json)586 assertions/31 groups PASS; [V8 6](allocation-v8.json)PASS including wallet-only and crossing-binade partial payments; [controls](allocation-controls.json)18 intended failures/clean teardown,16 required in CI.

Keep credit-first when exact. If that allocation cannot pay, try coarse credits first and then coarse sources including the wallet; preserve credit record ordering and the existing debit audit. Partial debits derive the adjacent representable value directly, rather than estimating symmetric ULP spacing. Real Echo2→3 costs4 from wallet2^54 while its1 credit remains; Swift1→2 costs5 and Swift16→17 costs1971 through exact alternative credit allocations. A credit2^54+4 plus wallet1 pays7 exactly across the lower binade. Independent BigInt conservation checks verify all totals; plans do not mutate inputs.

Prior combined CI38180910155 completed all gates successfully on head8a9500c/source46323fdd. It does not validate this final allocation change. Fresh required CI/integration/signed APK/native acceptance remain pending.

## Independent funding matrix

Source `678a1d4348ac9b99e18f9ec8aa26dec3ffdb147e5ef707014247ae10c0c430fc`: [focused report](funding-oracle-candidate.json)590 assertions/31 groups PASS; [independent oracle](funding-oracle.json)2016 cases PASS; [V8 6](funding-oracle-v8.json)PASS. Oracle exhaustively searches integer wallet/small-credit allocations for actual Echo0..5/Swift0..16 prices, eight wallets, four small credits and three large credits. BigInt independently checks representable remainders and exact conservation. It found otherwise payable Swift3/11-Prism cases missed by earlier fixed source ordering. A final fallback prioritizes the largest exact available contribution, preserving source record order and whole-Prism debits. The oracle is a required CI step.

The17 required controls now include funding-sources; local changed funding controls all fail intended assertions. Power-spacing directly verifies the largest exact partial debit because alternative funding can otherwise mask that component defect. No test gate or original assertion is removed. Fresh complete CI, integration, signed APK and native acceptance remain required.
