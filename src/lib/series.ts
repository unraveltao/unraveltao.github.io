import seriesData from '../../content/series.json';

export type SeriesMeta = { name: string; description?: string };

export const seriesRegistry = seriesData as Record<string, SeriesMeta>;

export function seriesName(key: string): string {
  return seriesRegistry[key]?.name ?? key;
}

export function seriesDescription(key: string): string | undefined {
  return seriesRegistry[key]?.description;
}
