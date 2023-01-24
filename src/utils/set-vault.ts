import { renderFile } from 'ejs';
import { writeFileSync } from 'fs';
import { join } from 'path';
import type { GetFeeds } from './get-feeds';

export const setVault = async (feeds: GetFeeds) => {
  try {
    const path = join(process.cwd(), 'src/templates/VAULT.ejs');
    writeFileSync('VAULT.md', await renderFile(path, { feeds }));

    console.log('✅ VAULT');
  } catch (_e) {
    console.error('❌ VAULT');
  }
};
