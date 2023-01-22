import chalk from 'chalk';
import { writeFileSync } from 'fs';
import { emptyDirSync } from 'fs-extra';
import { flat, sift, sort } from 'radash';
import upsertFeeds from './upsert-feeds';

emptyDirSync('public/feeds');

console.log(chalk.blue('\nFETCHING URLS...\n'));

const feeds = sift(await upsertFeeds());

console.log(chalk.blue('\nFETCHING LATEST...\n'));

try {
  const flattened = flat(feeds.map((feed) => feed.items));
  const sorted = sort(flattened, (feed) => feed.pubDate.valueOf(), true);
  const latest = sorted.slice(0, 20);

  writeFileSync('public/feeds/latest.json', JSON.stringify(latest, null, 2));
  console.log('✅ Latest 20 posts');
} catch (_e) {
  console.error('❌ Latest 20 posts');
}

console.log(chalk.blue('\nCOMPLETE!\n'));
