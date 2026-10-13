# Shared UI diagnostic001 — retained failure and precise test repair

The first actual diagnostic **failed**; it is not a completed browser gate.
[Run38110447923](https://github.com/karahaNx/Lumenfall/actions/runs/38110447923),
job114384721766, ran published candidate
`9f6ff0abe08c87ff8a7a007e5b51c89ca7e48233`, tree
`a265af37ed6d1e8c63546d4d29e53438e8f01e72`, parent accepted Comet
`fe2a7b32859ebe04ecd3382d7b74ef285f683771`. The standalone receipt step succeeded;
the browser step failed on2026-10-11 at04:06:09UTC and its artifact was retained.

## Actual failure

Chrome154.0.8037.97 reached natural startup readiness after6,243ms, with loaded
fonts, native animation frames and no observed startup/runtime errors. The
normal driver then failed after113 checks on the first profile:320px, root16px,
no-preference motion, Ember Wisp. No complete profile or exact CSS inverse was
accepted. The failing code is `wisp-glyph-outside-identity`; the driver exited1
without signal or timeout, while the browser closed normally with exit0.

The transparent `.hero-id` rectangle spans x91–231.59375 and
y437.59375–472.390625. Its Cinzel name uses16px text with1.3 line height:
the element's line box is20.796875px high, while each reported Range font box
is22px high and starts at y436.59375. That is precisely1px above the identity
rectangle. The existing half-pixel tolerance correctly exposes the predicate
mismatch; the tolerance must not be enlarged to hide it.

All name/class x bounds fit the identity column:91–200.015625. All glyphs fit
inside the header y426–484 and the card y413–1009.34375. The identity has
`overflow-x:visible; overflow-y:visible`. There is no overlap with the
Bench button, portrait, or between name and class. Both root and an independent
reviewer inspected the original failure PNG and confirmed legible, unclipped
text with space before Bench. A transparent, nonclipping line box is therefore
the wrong vertical rejection boundary for this typography measurement.

## Repair contract

Change only the new driver: retain horizontal identity-column containment and
the unchanged half-pixel tolerance, all full two-dimensional header/viewport
checks and every toggle/name/class/portrait overlap check. Verify the actual
card boundary and reject vertical identity clipping when its observed overflow
would clip. Preserve the product's original Cinzel font, size and line height.
No product, fixture, original suite or negative-control condition is changed
to fit this failure. This diagnosis is not evidence that all other profiles
or the three required inverses pass; those still need a new actual run.

## Original evidence identities

Product SHA256:
`38eebcb93e4cdc2fbb1f9f67800f8cfb433005904389c0815641d26bbae00b6f`.
Original driver SHA256:
`da1b05466ec74394402f93733b9f665276b42ed87ff5fa1067554804b548f609`.
Generated driver SHA256:
`b9d3276d59de4252d4176976fd8e611ba6fd1e7aa80832e748c945ec969b548e`.

Artifact11691409000:19,026,173bytes, SHA256
`7de6de69d0f15280607369a706cc11008ca28cbcba36bd43b20fbffc7cbf4ffa`.
The original ZIP's61 members passed CRC and extraction-byte checks. Retained
normal result:1,195,962bytes, SHA256
`634d64e9a642c810993159f44c9a64c5f815b659939e0e137ec2c4e1537b03bb`.
Failure PNG:179,350bytes, SHA256
`70a53f30c04a624b5ed9fd25c00796c8c4ebce9c582fbe14d53259643df3f566`.
Failure DOM:909,366bytes, SHA256
`7eadf249dd74f8b4da5860885390102cd88ae5a3b83c0c4dbdb6c2ec242c9fd8`.
Complete job log:18,559bytes, SHA256
`22d7dc1fa505b292281e2773692a3acb5ce7326d62045c69b55080c110f555b2`.

The original raw download, process stdout/stderr, screenshots, DOM, source and
receipt are frozen separately from the repair and will be included in the
durable Shared UI evidence publication. No original failure is overwritten or
relabeled as a pass. Main, draft PR102, APK and native-acceptance holds remain.
