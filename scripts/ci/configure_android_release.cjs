'use strict';
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
function configure(root = 'mobile/android') {
  const file = path.join(root, 'app/build.gradle');
  let text = fs.readFileSync(file, 'utf8');
  assert(text.includes('android {') && text.includes('release {'), 'Expected Capacitor Android build configuration');
  assert(!text.includes('testBuildType'), 'Release configuration must be applied once');
  text = text.replace('android {', 'android {\n    testBuildType "release"');
  text = text.replace(/testInstrumentationRunner "[^"]+"/, 'testInstrumentationRunner "com.lumenfall.qa.ReleaseProbe"');
  assert(text.includes('testInstrumentationRunner "com.lumenfall.qa.ReleaseProbe"'));
  text = text.replace('release {', 'release {\n            debuggable false');
  fs.writeFileSync(file, text);
  const testDir = path.join(root, 'app/src/androidTest/java/com/lumenfall/qa');
  fs.mkdirSync(testDir, {recursive: true});
  fs.copyFileSync(path.join(__dirname, '../../tests/android/ReleaseProbe.java'), path.join(testDir, 'ReleaseProbe.java'));
}
module.exports = {configure};
if (require.main === module) configure(process.argv[2]);
