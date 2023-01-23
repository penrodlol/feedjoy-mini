import dayjs from 'dayjs';
import { readFileSync, writeFileSync } from 'fs';

type Latest = Array<{ title: string; pubDate: Date; link: string }>;

const start = '<!-- POSTS_START -->';
const end = '<!-- POSTS_END -->';

export default async (latest: Latest) => {
  const current = readFileSync('README.md', 'utf8');
  const next = current.replace(
    new RegExp(`${start}[\\s\\S]*${end}`),
    `${start}\n${latest
      .map((post) => {
        const pubDate = dayjs(post.pubDate).format('MMM D, YYYY');
        return `[${post.title}](${post.link})<br /><i>${pubDate}</i><hr/>`;
      })
      .join('\n')}\n${end}`,
  );

  writeFileSync('README.md', next);
};
