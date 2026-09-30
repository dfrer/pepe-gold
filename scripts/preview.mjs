import {createServer} from 'node:http';
import {readFileSync,lstatSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
const output = fileURLToPath(new URL('../dist/', import.meta.url));
const files = new Set(['index.html','styles.css','assets/stars.webp','assets/earth.webp','assets/gold-pile.webp','assets/pepegold-character.webp','assets/pepegold-wordmark.webp','assets/tagline-gold-v2.webp','assets/gold-link-bar.webp','assets/x-logo.png','assets/telegram-logo.svg','assets/robinhood-chain-icon.jpg']);
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg'};
const port = Number(process.env.PORT || 4173);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw Error('Invalid local port');
const server = createServer((request,response) => {
  response.setHeader('X-Content-Type-Options','nosniff');
  response.setHeader('Cache-Control','no-store');
  if (!['GET','HEAD'].includes(request.method)) { response.writeHead(405,{'Allow':'GET, HEAD'}).end(); return; }
  let name;
  try { name = decodeURIComponent(new URL(request.url,'http://127.0.0.1').pathname).slice(1) || 'index.html'; }
  catch { response.writeHead(400).end(); return; }
  if (!files.has(name)) { response.writeHead(404).end(); return; }
  try {
    const path = resolve(output,name);
    if (lstatSync(output).isSymbolicLink() || lstatSync(resolve(output,'assets')).isSymbolicLink() || lstatSync(path).isSymbolicLink()) throw Error('Unexpected link');
    const body = readFileSync(path);
    response.writeHead(200,{'Content-Type':mime[extname(name)],'Content-Length':body.length});
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch { response.writeHead(404).end(); }
});
server.on('error',error=>{console.error(error.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log(`Preview: http://127.0.0.1:${port} (loopback only)`));
