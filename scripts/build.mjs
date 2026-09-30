import {copyFileSync,existsSync,lstatSync,mkdirSync,rmSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const files = ['index.html','styles.css','assets/stars.webp','assets/earth.webp','assets/gold-pile.webp','assets/pepegold-character.webp','assets/pepegold-wordmark.webp','assets/tagline-gold-v2.webp','assets/gold-link-bar.webp','assets/x-logo.png','assets/telegram-logo.svg','assets/robinhood-chain-icon.jpg'];
const output = resolve(root, 'dist');
if (lstatSync(resolve(root,'assets')).isSymbolicLink()) throw Error('Assets must be a real directory');
for (const file of files) if (!lstatSync(resolve(root,file)).isFile() || lstatSync(resolve(root,file)).isSymbolicLink()) throw Error('Build inputs must be regular files');
if (existsSync(output)) {
  if (!lstatSync(output).isDirectory() || lstatSync(output).isSymbolicLink()) throw Error('dist must be a real directory');
  rmSync(output, {recursive: true});
}
mkdirSync(resolve(output,'assets'), {recursive: true});
for (const file of files) copyFileSync(resolve(root,file),resolve(output,file));
console.log('Built 12 static files in dist/; no dependencies or page JavaScript.');
