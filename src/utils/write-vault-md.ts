import dayjs from 'dayjs';
import { readFileSync, writeFileSync } from 'fs';
import type { WriteFeeds } from './write-feeds';

const start = '<!-- POSTS_START -->';
const end = '<!-- POSTS_END -->';

export const writeVaultMD = async (feeds: WriteFeeds) => {
  try {
    const current = readFileSync('VAULT.md', 'utf8');
    const next = current.replace(
      new RegExp(`${start}[\\s\\S]*${end}`),
      `${start}\n${feeds
        .map((feed) => {
          const total = feed.items.length;
          const summary = `<summary>${feed.site}(${total})</summary><br />`;
          const items = feed.items
            .map((post) => {
              const pubDate = dayjs(post.pubDate).format('MMM D, YYYY');
              return (
                `<a href="${post.link}">${post.title}</a><br />` +
                `${feed.site} | <i>${pubDate}</i><hr/>`
              );
            })
            .join('\n');

          return `<details>${summary}${items}\n</details><br />`;
        })
        .join('\n')}\n${end}`,
    );

    writeFileSync('VAULT.md', next);

    console.log('✅ Vault');
  } catch (_e) {
    console.error('❌ Vault');
  }
};
