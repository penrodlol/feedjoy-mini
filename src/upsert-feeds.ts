import { writeFileSync } from 'fs';
import { parallel, unique } from 'radash';
import Parser from 'rss-parser';
import slugify from 'slugify';
import urls from '../public/input.json';

const parser = new Parser();
const batchSize = 5;

export default async () =>
  parallel(
    batchSize,
    unique(urls.map((url) => url.trim().replace(/www\./, ''))),
    async (url) =>
      parser
        .parseURL(url)
        .then(({ title, link, items: _items }) => {
          const slug = slugify(url, { lower: true, strict: true });
          const path = `public/feeds/${slug}.json`;
          const items = _items
            .filter((item) => item.title && item.link && item.pubDate)
            .map((item) => ({
              title: item.title as string,
              link: item.link as string,
              pubDate: new Date(item.pubDate as string),
            }));
          const payload = { title, link, items };

          try {
            writeFileSync(path, JSON.stringify(payload, null, 2));
            console.log(`✅ ${url}`);
            return payload;
          } catch (_e) {
            console.error(`❌ ${url}`);
            return null;
          }
        })
        .catch(() => {
          console.error(`❌ ${url}`);
          return null;
        }),
  );
