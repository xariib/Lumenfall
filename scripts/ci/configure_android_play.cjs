'use strict';
// Apply only to a fresh generated project. The established APK channel is separate.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
function configure(root = 'mobile/android') {
  const files = ['app/build.gradle', 'variables.gradle', 'build.gradle', 'gradle/wrapper/gradle-wrapper.properties'];
  const original = Object.fromEntries(files.map(file => [file, fs.readFileSync(path.join(root, file), 'utf8')]));
  const main = path.join(root, 'app/src/main');
  const activity = fs.readFileSync(path.join(main, 'java/com/lumenfall/app/MainActivity.java'), 'utf8');
  const manifest = fs.readFileSync(path.join(main, 'AndroidManifest.xml'), 'utf8');
  assert(activity.includes('public class MainActivity extends BridgeActivity {}'), 'Play requires a fresh project without the APK updater');
  assert(!/REQUEST_INSTALL_PACKAGES|UpdateFileProvider|\.updates/.test(manifest), 'APK installer must not enter the Play channel');
  for (const file of ['AppUpdaterPlugin.java', 'UpdatePolicy.java', 'UpdateFileProvider.java'])
    assert(!fs.existsSync(path.join(main, 'java/com/lumenfall/app', file)), 'APK updater source in Play project: ' + file);
  const replace = (text, pattern, replacement) => {
    assert.equal([...text.matchAll(new RegExp(pattern.source, 'g'))].length, 1, 'Expected exactly one generated field: ' + pattern);
    return text.replace(pattern, replacement);
  };
  const result = {...original};
  assert(original['app/build.gradle'].includes('applicationId "com.lumenfall.app"'), 'Preserve package identity');
  assert(!/signingConfig|debuggable/.test(original['app/build.gradle']), 'Fresh unsigned build required');
  result['app/build.gradle'] = replace(original['app/build.gradle'], /release \{/, 'release {\n            debuggable false');
  result['variables.gradle'] = replace(original['variables.gradle'], /compileSdkVersion = 34/, 'compileSdkVersion = 36');
  result['variables.gradle'] = replace(result['variables.gradle'], /targetSdkVersion = 34/, 'targetSdkVersion = 36');
  result['build.gradle'] = replace(original['build.gradle'], /com\.android\.tools\.build:gradle:8\.2\.1/, 'com.android.tools.build:gradle:8.13.2');
  result['gradle/wrapper/gradle-wrapper.properties'] = replace(original['gradle/wrapper/gradle-wrapper.properties'], /gradle-8\.2\.1-all\.zip/, 'gradle-8.13-bin.zip');
  // Validate every input before writing anything; never silently reconfigure a sideload build.
  for (const file of files) fs.writeFileSync(path.join(root, file), result[file]);
}
module.exports = {configure};
if (require.main === module) configure(process.argv[2]);
