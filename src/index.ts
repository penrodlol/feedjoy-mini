import chalk from 'chalk';
import { getFeeds } from './utils/get-feeds';
import { setReadme } from './utils/set-readme';
import { setVault } from './utils/set-vault';

console.log(chalk.blue('READING FEEDS...\n'));
const feeds = await getFeeds();

console.log(chalk.blue('\nUPDATING README...\n'));
await setReadme(feeds);

console.log(chalk.blue('\nUPDATING VAULT...\n'));
await setVault(feeds);

console.log(chalk.blue('\nCOMPLETE!\n'));
