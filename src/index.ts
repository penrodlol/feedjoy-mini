import chalk from 'chalk';
import { writeFileSync } from 'fs';
import { emptyDirSync } from 'fs-extra';
import { flat, sift, sort } from 'radash';
import upsertFeeds from './upsert-feeds';
import upsertMd from './upsert-md';

emptyDirSync('public/feeds');

console.log(chalk.blue('\nREADING/WRITING FEEDS...\n'));

const feeds = sift(await upsertFeeds());

console.log(chalk.blue('\nREADING/WRITING LATEST 30 POSTS...\n'));

try {
  const flattened = flat(feeds.map((feed) => feed.items));
  const sorted = sort(flattened, (feed) => feed.pubDate.valueOf(), true);
  const latest = sorted.slice(0, 30);

  writeFileSync('public/feeds/latest.json', JSON.stringify(latest, null, 2));
  upsertMd(latest);
  console.log('✅ Latest 30 posts');
} catch (_e) {
  console.error('❌ Latest 30 posts');
}

console.log(chalk.blue('\nCOMPLETE!\n'));
