import { writeFileSync } from 'fs';
import { parallel, sift, unique } from 'radash';
import Parser from 'rss-parser';
import slugify from 'slugify';
import input from '../../assets/input.json';

export type WriteFeeds = Awaited<ReturnType<typeof writeFeeds>>;

export const writeFeeds = async () => {
  const parser = new Parser();
  const urls = unique(input.map((url) => url.trim().replace(/www\./, '')));
  const payload = await parallel(5, urls, async (url) =>
    parser
      .parseURL(url)
      .then(({ title: site, link, items }) => {
        if (!site || !link || !items?.length) {
          console.error(`❌ ${url}`);
          return null;
        }

        const payload = {
          site,
          link,
          items: items
            .filter((item) => item.title && item.link && item.pubDate)
            .map((item) => ({
              title: item.title as string,
              link: item.link as string,
              pubDate: new Date(item.pubDate as string),
            })),
        };

        try {
          const slug = slugify(url, { lower: true, strict: true });
          const path = `dist/${slug}.json`;

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

  return sift(payload);
};
