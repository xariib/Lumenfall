package com.lumenfall.app;

import java.net.URI;
import java.util.Locale;

/** Shared, platform-independent trust and bounds checks. */
final class UpdatePolicy {
    static final String PACKAGE = "com.lumenfall.app";
    static final String CERT = "a91cbf3427d2ceb1cdbe07e5225f17d471b1829e52f7ab66497e754975ad3e21";
    static final String RELEASES = "https://api.github.com/repos/xariib/Lumenfall/releases/latest";
    static final long MAX_APK = 256L * 1024 * 1024;

    static long releaseCode(String tag) {
        if (!tag.matches("android-[0-9]{1,10}")) throw new IllegalArgumentException("Unsupported release version.");
        long code = Long.parseLong(tag.substring(8));
        if (code < 1 || code > 2100000000L) throw new IllegalArgumentException("Invalid release version.");
        return code;
    }

    static void trustedUrl(String value, boolean api) {
        URI u = URI.create(value);
        String host = u.getHost();
        if (!"https".equals(u.getScheme()) || u.getUserInfo() != null ||
            (u.getPort() != -1 && u.getPort() != 443) || u.getFragment() != null ||
            host == null || !(api ? "api.github.com".equals(host) :
            "github.com".equals(host) || "release-assets.githubusercontent.com".equals(host) ||
            "objects.githubusercontent.com".equals(host)))
            throw new IllegalArgumentException("Untrusted update address.");
    }

    static void assetUrl(String value, String tag, String name) {
        trustedUrl(value, false);
        if (!value.equals("https://github.com/xariib/Lumenfall/releases/download/" + tag + "/" + name))
            throw new IllegalArgumentException("Update asset is not from the official release.");
    }

    static void validateSize(long size) {
        if (size <= 0 || size > MAX_APK) throw new IllegalArgumentException("Invalid update size.");
    }

    static String checksum(String text) {
        String[] fields = text.trim().split("\\s+");
        if (fields.length != 2 || !fields[0].matches("[a-fA-F0-9]{64}") ||
            !("Lumenfall.apk".equals(fields[1]) || "*Lumenfall.apk".equals(fields[1])))
            throw new IllegalArgumentException("Invalid release checksum.");
        return fields[0].toLowerCase(Locale.ROOT);
    }

    static void archive(String name, long code, long installed, long expected, int sdk, int deviceSdk, String cert) {
        if (!PACKAGE.equals(name) || code != expected || code <= installed || sdk > deviceSdk || !CERT.equals(cert))
            throw new IllegalArgumentException("APK identity, version, compatibility or signing verification failed.");
    }
}
