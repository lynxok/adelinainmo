import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = __dirname;
const distAssetsDir = path.join(rootDir, 'dist', 'assets');
const rootAssetsDir = path.join(rootDir, 'assets');

if (!fs.existsSync(rootAssetsDir)) {
  fs.mkdirSync(rootAssetsDir, { recursive: true });
}

// 1. Remove old bundle files from root assets
const rootFiles = fs.readdirSync(rootAssetsDir);
for (const file of rootFiles) {
  if (file.startsWith('index-') && (file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.map'))) {
    fs.unlinkSync(path.join(rootAssetsDir, file));
  }
}

// 2. Copy current dist bundles to root assets
if (fs.existsSync(distAssetsDir)) {
  const distFiles = fs.readdirSync(distAssetsDir);
  for (const file of distFiles) {
    if (file.startsWith('index-') && (file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.map'))) {
      fs.copyFileSync(path.join(distAssetsDir, file), path.join(rootAssetsDir, file));
      console.log(`[sync-dist] Copied ${file} to root assets/`);
    }
  }
}

console.log('[sync-dist] Sync completed successfully.');
