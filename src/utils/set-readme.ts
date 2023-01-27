import { renderFile } from 'ejs';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { flat, sort } from 'radash';
import type { GetFeeds } from './get-feeds';

export const setReadme = async (feeds: GetFeeds) => {
  try {
    const flattened = flat(feeds.map((feed) => feed.items));
    const sorted = sort(flattened, (feed) => feed.pubDate.valueOf(), true);
    const posts = sorted.slice(0, 30);

    const path = join(process.cwd(), 'src/templates/README.ejs');
    writeFileSync('README.md', await renderFile(path, { posts }));

    console.log('✅ README');
  } catch (_e) {
    console.error('❌ README');
  }
};
