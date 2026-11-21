package com.lumenfall.app;

import android.webkit.WebView;
import androidx.activity.OnBackPressedCallback;
import androidx.activity.OnBackPressedDispatcher;
import com.getcapacitor.BridgeActivity;

final class GameBackNavigation extends OnBackPressedCallback {
    private final BridgeActivity activity;
    private final OnBackPressedDispatcher dispatcher;
    private boolean pending;

    static void install(BridgeActivity activity) {
        if (activity.getBridge() == null) return;
        GameBackNavigation callback = new GameBackNavigation(activity);
        callback.dispatcher.addCallback(activity, callback);
    }

    private GameBackNavigation(BridgeActivity activity) {
        super(true);
        this.activity = activity;
        dispatcher = activity.getOnBackPressedDispatcher();
    }

    @Override public void handleOnBackPressed() {
        if (pending) return;
        WebView page = activity.getBridge().getWebView();
        pending = true;
        page.evaluateJavascript("typeof window.lumenfallHandleBack === 'function' && window.lumenfallHandleBack()", result -> {
            pending = false;
            if ("true".equals(result) || activity.isFinishing() || activity.isDestroyed()) return;
            // Let the original Android task behavior handle Back at the game root.
            setEnabled(false);
            try {
                dispatcher.onBackPressed();
            } finally {
                setEnabled(true);
            }
        });
    }
}
