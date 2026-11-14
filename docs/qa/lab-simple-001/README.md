# Simpler Lab — evidence

Integrated [PR51](https://github.com/xariib/Lumenfall/pull/51), commit
9af688888cba5fe1c2a3426b7087a5e2d14bb6f5, product SHA256
81c503892ab7c9ec7af0ad5b7dcb923d1efc222c3d5820bcb29ce44e42623db9,
preserving accepted main 5f0d9762.
[Android 0.2.117](https://github.com/xariib/Lumenfall/releases/tag/android-1000117) is published. Signed APK SHA256:
41333a20680c8467b1a241ec2831387da7149198426acbb6d0b3bd6e71ab268f.

pr-ci.json and integrated-ci.json record all eight PR/manual workflows PASS,
including 190 deterministic scenarios and isolated offline catch-up per full run.
Full logs: ci-job-132436893075.log.gz (PR), ci-job-132439490021.log.gz (manual),
ci-job-132439518544.log.gz (Lab core/mobile and actual V8 6.0). Final-source
first-attempt logs 132436893022/132439539206 retain browser connection/screenshot
timeouts; unchanged retries PASS, without changing limits or assertions.

android-release/ holds native receipts; verification.json binds exact source,
package/certificate, all 15 assets, both saves/paid work, updater and retail launch.
public-release.json verifies anonymous versioned/latest bytes, checksum and feed.
Native screenshot inspected. Physical-phone, exact WebView60 DOM, TalkBack and
human design acceptance remain unverified; task/chat stays open. Self-review and
automated checks only.

replay-details.json verifies four paired 8h windows: complete saved states,
rewards and all original canonical endpoints match. Baseline 5040ea14 has the
same product bytes as accepted main 5f0d9762. combined-source.json records proof.
Final local selection 344/18 profiles and clarity/Deeds 1072 PASS. Source-qualified
slot/menu 488, Deeds core 313 and other focused receipts remain below. All 39 task
contexts PASS. Previews show the same Lab markup/CSS as the published source.

android-candidate/ is historical 0.2.115, run 43583498617, source af371f2e at b6860e30.
It predates accepted Deeds; it is not final delivery. Older evidence retains its
actual source, status and limitations.

## Earlier candidates and findings

Baseline main858d713f, product ce51bc14. Node24.22.1/Windows and
Chromium157.0.8103.79. Baseline slot/menu488, queue64 and slot55 PASS.

Browser receipts: simple344/18 profiles; slots488/18; clarity524/18;
slot-challenges290/12; access890/12; boost-queue993/18; longtail326/12;
timed1182/12. `negative.json` deliberately removes confirmation and fails
at the required replacement-dialog assertion with clean browser teardown.
Each receipt records its exact source SHA and browser version. Initial results
use1f32cd8b; final source48f96606 only expands CSS inset into equivalent
top/right/bottom/left properties for WebView60. Final simple/slot reruns and
GitHub checks are recorded separately as available.

`replay.json`: four8h windows per source,115200 independent one-second calls
on both main and candidate. Full endpoint states, rewards and accepted
canonical hashes all match. No expected state or reward vector changed;
only the oracle's product source binding changed. The final CSS-only delta
is recorded, with identical complete script bytes verified.

Original core checks: queue64, timed boosts1480, workshop/slot417 PASS.
The original22-scenario browser regression exposed its old immediate-switch
assumption in r3-destinations. The test now explicitly checks the prompt and
unchanged state before confirming; all original queue/payment assertions remain.

Visuals: inspected normal/enlarged mobile timer and confirmation screenshots.
Self-review and automated checks only; no independent review claimed.
First CI head4fb7732e: Lab and Wisp workflows passed; permanent progression
failed its old immediate-switch expectation (run43573977692/job132384093031).
Its UI now checks the prompt before confirming; local488 assertions PASS.
Pre-merge43573977650/job132384093519 stopped at the32KiB startup gate.
Condensed shared status summaries without dropping evidence links; all39
workflow task contexts now PASS (`contexts.json`). No gate/budget changes.
CI, integration and Android delivery remain pending until receipts are saved.
Physical-phone, exact WebView60 DOM and TalkBack acceptance are unverified.

Combined main integration: currency header/PR49 advanced main to7f149b89.
The combined page is af371f2e; every script byte equals the verified Lab
candidate, while the currency change is CSS-only. combined-source.json proves
script identity and unchanged canonical vectors. Current simple344 and slots488
pass on af371f2e; combined-currency.json.gz preserves1776 layout assertions
across16 profiles. Previews now show both accepted changes. All39 task contexts
pass. Earlier receipts/logs retain their actual source48f96606 and are not
claims that combined-source CI or Android acceptance has completed.
