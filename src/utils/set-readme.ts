import { load } from 'cheerio';
import { renderFile } from 'ejs';
import { writeFileSync } from 'fs';
import fetch from 'node-fetch';
import { join } from 'path';
import { flat, parallel, sort } from 'radash';
import type { GetFeeds } from './get-feeds';

export const setReadme = async (feeds: GetFeeds) => {
  try {
    const flattened = flat(feeds.map((feed) => feed.items));
    const sorted = sort(flattened, (feed) => feed.pubDate.valueOf(), true);
    const posts = await parallel(5, sorted.slice(0, 30), async (post) => {
      const $ = load(await fetch(post.link as string).then((r) => r.text()));
      const image = $('meta[property="og:image"]').attr('content');

      return { ...post, image };
    });

    const path = join(process.cwd(), 'src/templates/README.ejs');
    writeFileSync('README.md', await renderFile(path, { posts }));

    console.log('✅ README');
  } catch (_e) {
    console.error('❌ README');
  }
};
