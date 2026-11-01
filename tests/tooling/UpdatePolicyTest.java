package com.lumenfall.app;

public class UpdatePolicyTest {
    private static int checks;
    private static void ok(boolean value) { checks++; if (!value) throw new AssertionError("Check " + checks); }
    private static void reject(Runnable action) {
        checks++;
        try { action.run(); } catch (IllegalArgumentException expected) { return; }
        throw new AssertionError("Expected rejection at " + checks);
    }
    public static void main(String[] args) {
        ok(UpdatePolicy.releaseCode("android-1000069") == 1000069);
        for (String tag : new String[]{"android--1", "beta-1000069", "android-0", "android-2100000001", "android-999999999999"})
            reject(() -> UpdatePolicy.releaseCode(tag));
        UpdatePolicy.trustedUrl(UpdatePolicy.RELEASES, true);
        for (String url : new String[]{"http://github.com/file", "https://github.com.evil.test/file", "https://evil@github.com/file", "https://github.com:444/file", "https://github.com/file#fragment", "file:///update.apk", "https://evil.test/"})
            reject(() -> UpdatePolicy.trustedUrl(url, false));
        reject(() -> UpdatePolicy.trustedUrl("https://github.com/api", true));
        UpdatePolicy.trustedUrl("https://release-assets.githubusercontent.com/file?signature=123", false);
        UpdatePolicy.trustedUrl("https://objects.githubusercontent.com/file", false);
        String asset = "https://github.com/xariib/Lumenfall/releases/download/android-1000069/Lumenfall.apk";
        UpdatePolicy.assetUrl(asset, "android-1000069", "Lumenfall.apk");
        reject(() -> UpdatePolicy.assetUrl(asset.replace("xariib", "attacker"), "android-1000069", "Lumenfall.apk"));
        reject(() -> UpdatePolicy.assetUrl(asset, "android-1000070", "Lumenfall.apk"));
        String hash = "a".repeat(64);
        ok(UpdatePolicy.checksum(hash + "  Lumenfall.apk\n").equals(hash));
        ok(UpdatePolicy.checksum(hash.toUpperCase() + " *Lumenfall.apk").equals(hash));
        reject(() -> UpdatePolicy.checksum(hash + "  other.apk"));
        reject(() -> UpdatePolicy.checksum(hash + "  Lumenfall.apk\n" + hash + " other.apk"));
        reject(() -> UpdatePolicy.checksum("invalid  Lumenfall.apk"));
        UpdatePolicy.validateSize(1024);
        for (long size : new long[]{0, -1, UpdatePolicy.MAX_APK + 1}) reject(() -> UpdatePolicy.validateSize(size));
        UpdatePolicy.archive(UpdatePolicy.PACKAGE, 1000070, 1000069, 1000070, 22, 31, UpdatePolicy.CERT);
        reject(() -> UpdatePolicy.archive("com.attacker.app", 1000070, 1000069, 1000070, 22, 31, UpdatePolicy.CERT));
        reject(() -> UpdatePolicy.archive(UpdatePolicy.PACKAGE, 1000069, 1000069, 1000069, 22, 31, UpdatePolicy.CERT));
        reject(() -> UpdatePolicy.archive(UpdatePolicy.PACKAGE, 1000068, 1000069, 1000068, 22, 31, UpdatePolicy.CERT));
        reject(() -> UpdatePolicy.archive(UpdatePolicy.PACKAGE, 1000071, 1000069, 1000070, 22, 31, UpdatePolicy.CERT));
        reject(() -> UpdatePolicy.archive(UpdatePolicy.PACKAGE, 1000070, 1000069, 1000070, 32, 31, UpdatePolicy.CERT));
        reject(() -> UpdatePolicy.archive(UpdatePolicy.PACKAGE, 1000070, 1000069, 1000070, 22, 31, hash));
        System.out.println("PASS native update trust policy: " + checks + " assertions and rejection controls");
    }
}
