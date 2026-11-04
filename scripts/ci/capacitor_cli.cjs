'use strict';
// Capacitor6's compiled CLI expects tar.default. Patched tar7 exposes named
// CommonJS exports with __esModule=true. Adapt that import in this build process
// instead of retaining vulnerable tar6 or changing the Android runtime major.
const path=require('node:path'),assert=require('node:assert/strict');
const mobile=path.resolve(__dirname,'../../mobile');
const cli=require.resolve('@capacitor/cli/bin/capacitor',{paths:[mobile]});
const tar=require(require.resolve('tar',{paths:[path.dirname(cli)]}));
assert.equal(typeof tar.extract,'function');
if(!tar.default)Object.defineProperty(tar,'default',{value:tar});
require(cli);
