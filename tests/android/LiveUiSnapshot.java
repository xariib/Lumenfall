package com.lumenfall.qa;

import java.io.File;
import java.lang.reflect.Method;

/** Shell-only accessibility capture; never installed in or packaged with the game. */
public final class LiveUiSnapshot {
    public static void main(String[] args) throws Exception {
        if (args.length != 3) throw new IllegalArgumentException("output.xml width height");
        // Use the same shell bridge and hierarchy dumper as Android's uiautomator command.
        // Its dump command first requires a globally idle accessibility stream, which a
        // running battle need not provide. Capture the actual live tree instead.
        Class<?> wrapperType = Class.forName("com.android.uiautomator.core.UiAutomationShellWrapper");
        Object wrapper = wrapperType.getConstructor().newInstance();
        wrapperType.getMethod("connect").invoke(wrapper);
        try {
            wrapperType.getMethod("setCompressedLayoutHierarchy", boolean.class).invoke(wrapper, false);
            Object automation = wrapperType.getMethod("getUiAutomation").invoke(wrapper);
            // Allow the newly connected service to receive its initial WebView tree;
            // this does not wait for combat or accessibility events to become idle.
            Thread.sleep(1000);
            Method getRoot = Class.forName("android.app.UiAutomation").getMethod("getRootInActiveWindow");
            Class<?> nodeType = Class.forName("android.view.accessibility.AccessibilityNodeInfo");
            Method dump = Class.forName("com.android.uiautomator.core.AccessibilityNodeInfoDumper")
                .getMethod("dumpWindowToFile", nodeType, File.class, int.class, int.class, int.class);
            File output = new File(args[0]);
            long deadline = System.currentTimeMillis() + 10000;
            boolean captured = false;
            // Connecting the accessibility bridge is asynchronous. A null root is not
            // evidence of launch success; the Node caller still verifies visible controls.
            do {
                Object root = getRoot.invoke(automation);
                if (root != null) {
                    try {
                        dump.invoke(null, root, output, 0, Integer.parseInt(args[1]), Integer.parseInt(args[2]));
                    } finally {
                        nodeType.getMethod("recycle").invoke(root);
                    }
                    captured = true;
                    break;
                }
                Thread.sleep(200);
            } while (System.currentTimeMillis() < deadline);
            if (!captured) throw new IllegalStateException("No live accessibility root within 10 seconds");
        } finally {
            wrapperType.getMethod("disconnect").invoke(wrapper);
        }
        System.exit(0);
    }
}
