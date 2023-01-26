import dayjs from 'dayjs';
import { parallel, sift, unique } from 'radash';
import Parser from 'rss-parser';
import slugify from 'slugify';
import _urls from '../../assets/urls.json' assert { type: 'json' };

export type GetFeeds = Awaited<ReturnType<typeof getFeeds>>;

export const getFeeds = async () => {
  const parser = new Parser();
  const urls = unique(_urls.map((url) => url.trim().replace(/www\./, '')));
  const payload = await parallel(5, urls, async (url) =>
    parser
      .parseURL(url)
      .then(({ title: site, link, items }) => {
        if (!site || !link || !items?.length) {
          console.error(`❌ ${url}`);
          return null;
        }

        console.log(`✅ ${url}`);

        return {
          site,
          link,
          total: items.length,
          slug: slugify(url, { lower: true, strict: true }),
          items: items
            .filter((item) => item.title && item.link && item.pubDate)
            .map(({ title, link, pubDate: _pubDate }) => {
              const pubDate = new Date(_pubDate as string);
              const formattedPubDate = dayjs(pubDate).format('MMM D, YYYY');

              return { site, title, link, pubDate, formattedPubDate };
            })
            .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf()),
        };
      })
      .catch(() => {
        console.error(`❌ ${url}`);
        return null;
      }),
  );

  return sift(payload);
};
