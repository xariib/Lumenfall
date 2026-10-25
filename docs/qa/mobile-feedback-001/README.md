# Mobile feedback evidence

Current product SHA-256: b03770981e9fd0a4cc53d37021761cf93f148a0aae82874423780f8015f9efa2.
Browser/boot receipts below are preceding a6420cdb evidence; final-head CI is in PR #9.

- core.json: Node 24.22.1 contribution/support negative controls, progression and Farm guidance.
- preservation.json: 29 protected declarations byte-identical to main 7df7f5c.
- startup-order.json: actual return-flow functions, both completion orders, errors and stale generation; baseline fails intro-first assertion; reviewed source fails the 500ms resume regression.
- startup-browser.json: Chrome 155 native input, 24 profiles; original run 40184674615.
- boot.png: inspected first paint before the game script executes (390 px).

These receipts concern their recorded exact source. See [task](../../tasks/MOBILE_FEEDBACK_001.md)
and [PR](https://github.com/xariib/Lumenfall/pull/9) for final CI/integration and
Android status. Modern Chromium does not establish installed WebView or physical-phone acceptance.
