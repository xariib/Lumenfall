package com.lumenfall.qa;

import android.app.Instrumentation;
import android.content.Intent;
import android.os.Bundle;
import android.webkit.WebView;

/** CI-only, separately signed instrumentation. Never packaged in Lumenfall.apk. */
public final class ReleaseProbe extends Instrumentation {
    @Override public void onCreate(Bundle arguments) {
        super.onCreate(arguments);
        start();
    }

    @Override public void onStart() {
        // Android requires this separate APK to share the target's signing key.
        // This changes only the instrumented test process, not the release APK.
        Intent intent = new Intent(Intent.ACTION_MAIN);
        intent.setClassName("com.lumenfall.app", "com.lumenfall.app.MainActivity");
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivitySync(intent);
        runOnMainSync(() -> WebView.setWebContentsDebuggingEnabled(true));
        // Keep instrumentation attached until the test explicitly stops/replaces
        // the target. The host runner has its own bounded watchdog.
        try { Thread.sleep(20 * 60 * 1000L); }
        catch (InterruptedException interrupted) { Thread.currentThread().interrupt(); }
        finish(0, new Bundle());
    }
}
