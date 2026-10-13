# Shared UI diagnostic002 — transparent header versus actual clipping

[Run38111030896](https://github.com/karahaNx/Lumenfall/actions/runs/38111030896)
on candidate `33153db7a59dbf0d69412241a33ac076177dee7f`, tree
`cc089d0e0eed799c0a807f10530bcc3d284622ba`, **failed** in the browser step at
04:17:17UTC on2026-10-11. Job114386449463 preserved its artifact. All eight
standalone commands passed, but this remains an incomplete browser diagnostic.

## Recorded result and cause

The normal driver reached982 checks and completed the two320px/root16 profiles
(both motion settings). It stopped on the third profile,320px/root32 with
no-preference motion, at Ember's `wisp-glyph-outside-header` assertion.
The three CSS inversions were not executed. The driver exited1; the browser
closed normally with exit0 and no signal. Product bytes remain unchanged.

The header is a transparent, overflow-visible flex box spanning
x23–297 and y348–479.796875. Its first row's identity starts at y348;
the Cinzel name's typographic Range starts at y347. This is the same1px font
overhang seen in diagnostic001, now extending over the header because the
enlarged identity determines the first row's height. The class spans two lines
at y369.796875–421.796875. Bench occupies the separate next row at
y431.796875–479.796875, as intended by the CSS fix.

All name/class glyph x bounds91–234.859375 fit the header and identity. All
glyphs lie inside the clipping card (y335–1342.140625) and visible main region
(y129–782). The observed failure PNG shows readable, unclipped identity text,
clear class wrapping and separation from Bench and the portrait. Root and the
independent browser reviewer inspected that original image directly.

The strict vertical header predicate was therefore another incorrect use of a
nonclipping structural box. Enlarging the tolerance or changing product fonts
would hide the distinction. Instead, repair003 keeps horizontal header/identity
containment and the0.5px tolerance, records actual ancestors whose computed
overflow clips on each axis, and checks glyphs against their inner client
rectangles, the visible main/viewport and the full card. Original overlap,
input, focus, save-purity and exact inverse assertions remain required.

The new measurements only observe DOM/styles. They neither repair layout nor
replace native handlers. Their prepare-only compilation is separate from the
next actual browser run. Completing two profiles does not establish all12,
the three required inverse causes, or final combined regression acceptance.

## Frozen original evidence

Product SHA256:
`38eebcb93e4cdc2fbb1f9f67800f8cfb433005904389c0815641d26bbae00b6f`.
Diagnostic driver SHA256:
`d95e30aa66b101bcfb8afcde023697e12acad581544964ece39a8304aa714abe`.
Artifact11691103802:23,472,597bytes, SHA256
`1397f3880d34ed905c83508611983faf8b67a79edc08a820c4e37ae75164deae`.
All73 original ZIP members passed CRC/path/byte verification.

The original normal receipt is10,003,337bytes, SHA256
`09fd6f9c90df523cc681d6bd4364b633b523639c0eae3ca2e995fe42b1496ce1`.
Failure PNG:185,762bytes, SHA256
`f0dcd8cf279bac8ab85ec9f76137daec3491a78018b18ef1566470dc8b7e2dc8`.
Failure DOM:909,366bytes, SHA256
`8cc9789f0e455cc32279a8880f8d75abc432058db7e35b3c80a2b0b3f24024b7`.

The closed raw manifest is SHA256
`cdf5e73860b67bd874eb6c3e4ea3afc7dc688afc6f74b0c72e58da72a16e273e`,
covering808 bodies and101,436,308bytes. All699 archived source bodies match the
immutable candidate's Git blobs; all18 input snapshots match. The complete
17,869byte job log is retained. Only the explicitly pinned signed artifact
download response is excluded from public transport:2,139bytes, SHA256
`5a93d2735d7cafefeebde147303fd91c15b4a7ed1314b37cbdf583e37087e91c`.
Its original private bytes remain unchanged; no source, test output, DOM or
image is discarded. This second failed run will be published alongside its
separate repair and later acceptance evidence.
