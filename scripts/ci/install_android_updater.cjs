'use strict';
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
function install(root = 'mobile/android') {
  const main = path.join(root, 'app/src/main');
  const java = path.join(main, 'java/com/lumenfall/app');
  const activity = path.join(java, 'MainActivity.java');
  let code = fs.readFileSync(activity, 'utf8');
  assert(code.includes('public class MainActivity extends BridgeActivity {}'), 'Unexpected generated MainActivity');
  code = code.replace('public class MainActivity extends BridgeActivity {}', `public class MainActivity extends BridgeActivity {
    @Override public void onCreate(android.os.Bundle savedInstanceState) {
        registerPlugin(AppUpdaterPlugin.class);
        super.onCreate(savedInstanceState);
    }
}`);
  fs.writeFileSync(activity, code);
  for (const file of ['AppUpdaterPlugin.java', 'UpdatePolicy.java'])
    fs.copyFileSync(path.join(__dirname, '../../mobile/native', file), path.join(java, file));
  const manifest = path.join(main, 'AndroidManifest.xml');
  let xml = fs.readFileSync(manifest, 'utf8');
  assert(xml.includes('</application>') && xml.includes('</manifest>'), 'Unexpected Android manifest');
  xml = xml.replace('</application>', `<provider android:name="androidx.core.content.FileProvider"
            android:authorities="\${applicationId}.updates" android:exported="false" android:grantUriPermissions="true">
            <meta-data android:name="android.support.FILE_PROVIDER_PATHS" android:resource="@xml/update_paths" />
        </provider>
    </application>`).replace('</manifest>', '    <uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />\n</manifest>');
  fs.writeFileSync(manifest, xml);
  fs.mkdirSync(path.join(main, 'res/xml'), {recursive: true});
  fs.writeFileSync(path.join(main, 'res/xml/update_paths.xml'), '<?xml version="1.0" encoding="utf-8"?>\n<paths xmlns:android="http://schemas.android.com/apk/res/android"><files-path name="updates" path="updates/" /></paths>\n');
}
module.exports = {install};
if (require.main === module) install(process.argv[2]);
