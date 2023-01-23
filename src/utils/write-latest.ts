import { writeFileSync } from 'fs';
import { flat, sort } from 'radash';
import type { WriteFeeds } from './write-feeds';

export type WriteLatest = Awaited<ReturnType<typeof writeLatest>>;

export const writeLatest = async (feeds: WriteFeeds) => {
  const flattened = flat(
    feeds.map((f) => f.items.map((p) => ({ site: f.site, ...p }))),
  );
  const sorted = sort(flattened, (feed) => feed.pubDate.valueOf(), true);
  const latest = sorted.slice(0, 30);

  writeFileSync('dist/latest.json', JSON.stringify(latest, null, 2));

  return latest;
};
