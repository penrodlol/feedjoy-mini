import dayjs from 'dayjs';
import { readFileSync, writeFileSync } from 'fs';
import type { WriteLatest } from './write-latest';

const start = '<!-- POSTS_START -->';
const end = '<!-- POSTS_END -->';

export const writeLatestMD = async (latest: WriteLatest) => {
  const current = readFileSync('README.md', 'utf8');
  const next = current.replace(
    new RegExp(`${start}[\\s\\S]*${end}`),
    `${start}\n${latest
      .map((post) => {
        const pubDate = dayjs(post.pubDate).format('MMM D, YYYY');
        return (
          `<strong>[${post.title}](${post.link})</strong><br />` +
          `${post.site} | <i>${pubDate}</i><hr/>`
        );
      })
      .join('\n')}\n${end}`,
  );

  writeFileSync('README.md', next);
};
