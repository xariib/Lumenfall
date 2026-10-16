# Original signing identity recovered — 16 October 2026

The user signed into the original `karahaNx` account and authorized downloading
and verifying the existing signing keystore. The private draft remains private;
no release, repository, workflow, package or signing identity was changed.

## Result

The original asset was downloaded to `%USERPROFILE%\Downloads\Lumenfall-debug.keystore`,
outside Git. Do not include the private file in a source commit or chat output.

- Actual size: 2682 bytes.
- Actual file SHA-256: `0f628d30730e7e8f1a34a4df60a13227540533141d9481d0e837100db900d65c`.
- Actual certificate SHA-256: `A9:1C:BF:34:27:D2:CE:B1:CD:BE:07:E5:22:5F:17:D4:71:B1:82:9E:52:F7:AB:66:49:7E:75:49:75:AD:3E:21`.
- PKCS12 container MAC verified with the established workflow password.
- A random challenge signed with the recovered private key verifies against
  the matching certificate. Decrypted private material was handled only in
  process memory and was never printed or saved.

[Actual verification receipt](verification.json), [verifier](verify-keystore.cjs),
[negative controls](controls.json) and [control driver](verify-keystore-controls.cjs).
Tampering with the input bytes or using a wrong password fails without emitting
a passing receipt. Both controls run in memory; the original file stays unchanged.

## Retrieval and provenance

The ordinary releases list appeared empty, and the pending tag URL returned404,
even in the owner browser session. These results did not establish loss of a
private draft. Its exact `untagged-…` URL was recovered from the CRC-verified
`receipts/before/signing-release-id.json` in the historical original
`docs/handoffs/01_06/2026-10-07/originals/Lumenfall_01_06_Signing_Diagnose_00_08_2026-10-04(1).zip`.
That record identifies draft396126590 and asset586981383. The live owner-session
page showed the same asset name, size and digest. The downloaded bytes match
both historical metadata and the current page digest.

The download-media helper first timed out without returning a path. The normal
authenticated browser download then completed and returned the Downloads path.
The connector's separate `xariib` session still returned404 for release-by-ID;
browser sign-in did not change connector credentials.

Verification used Node24.19.0 and the existing Git `mingw64/bin/openssl.exe`,
OpenSSL3.5.7. An initial attempt using Git's `usr/bin/openssl.exe` failed its
version invocation with exit3221225794; it did not reach keystore inspection.
No Java/keytool or Android SDK was installed for this check.

To reproduce from the repository root, pass the actual local keystore and
existing OpenSSL paths as the two arguments to each Node verifier above.
Only the public receipts and verification code belong in Git.

## Remaining update acceptance

Signing-key recovery is verified. A complete app update is still untested:
the final APK must retain `com.lumenfall.app`, use this signing identity, have
a versionCode above distributed versions, and preserve Capacitor origin/save
storage. Verify the packaged APK and install over an existing installation
without clearing data before claiming end-to-end update compatibility.
The new repository URL, private key provisioning there, full CI and native
acceptance remain outstanding. No APK was built, signed, installed or published.
