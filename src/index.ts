import chalk from 'chalk';
import { writeFileSync } from 'fs';
import type { Output } from 'rss-parser';
import Parser from 'rss-parser';
import urls from '../public/input.json';

const parser = new Parser();
const feeds: Array<Output<unknown>> = [];

console.log(chalk.blue('\nPARSING URLS...\n'));

await Promise.all(
  urls.map(async (url) =>
    parser
      .parseURL(url)
      .then((feed) => {
        console.log(chalk.blue(`✅ ${url}`));
        feeds.push(feed);
      })
      .catch((error) => console.error(chalk.red(`ERROR: ${url}/n${error}`))),
  ),
);

const payload = feeds
  .flatMap((feed) =>
    feed.items
      .filter((post) => feed.title && post.title && post.link && post.pubDate)
      .map((post) => ({
        site: feed.title,
        title: post.title,
        link: post.link,
        pubDate: new Date(post.pubDate as string),
      })),
  )
  .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

try {
  writeFileSync('./public/output.json', JSON.stringify(payload, null, 2));
  console.log(chalk.blue('\nCOMPLETE!\n'));
} catch (error) {
  console.error(chalk.red(error));
}
