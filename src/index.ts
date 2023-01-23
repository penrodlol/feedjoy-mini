import chalk from 'chalk';
import { emptyDirSync } from 'fs-extra';
import { writeFeeds } from './utils/write-feeds';
import { writeLatest } from './utils/write-latest';
import { writeLatestMD } from './utils/write-latest-md';

emptyDirSync('dist');

console.log(chalk.blue('\nREADING/WRITING FEEDS...\n'));

const feeds = await writeFeeds();

try {
  console.log(chalk.blue('\nREADING/WRITING LATEST 30 POSTS...\n'));

  const latest = await writeLatest(feeds);
  await writeLatestMD(latest);

  console.log('✅ Latest 30 posts');
} catch (_e) {
  console.error('❌ Latest 30 posts');
}

console.log(chalk.blue('\nCOMPLETE!\n'));
