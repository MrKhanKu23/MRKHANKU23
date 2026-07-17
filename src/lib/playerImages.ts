const imageCache = new Map<string, string | null>();

type PageImage = { index?: number; thumbnail?: { source?: string } };
type PageImageResponse = { query?: { pages?: Record<string, PageImage> } };
type WikidataSearch = { search?: { id: string; label: string; description?: string }[] };
type WikidataEntities = { entities?: Record<string, { claims?: { P18?: { mainsnak?: { datavalue?: { value?: string } } }[] } }> };

async function requestImage(parameters: URLSearchParams) {
  const response = await fetch(`https://en.wikipedia.org/w/api.php?${parameters}`);
  if (!response.ok) return undefined;
  const result = await response.json() as PageImageResponse;
  return Object.values(result.query?.pages ?? {})
    .sort((first, second) => (first.index ?? Number.MAX_SAFE_INTEGER) - (second.index ?? Number.MAX_SAFE_INTEGER))
    .find((page) => page.thumbnail?.source)?.thumbnail?.source;
}

function normalized(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function requestWikidataImage(name: string) {
  const searchParameters = new URLSearchParams({
    action: 'wbsearchentities', format: 'json', origin: '*', language: 'en', type: 'item', limit: '8', search: name,
  });
  const searchResponse = await fetch(`https://www.wikidata.org/w/api.php?${searchParameters}`);
  if (!searchResponse.ok) return undefined;
  const search = await searchResponse.json() as WikidataSearch;
  const sportsWords = /player|football|basketball|tennis|driver|fighter|swimmer|sprinter|athlete|baseball|volleyball|esports|gamer/i;
  const match = search.search?.find((item) => normalized(item.label) === normalized(name) && sportsWords.test(item.description ?? ''));
  if (!match) return undefined;

  const entityParameters = new URLSearchParams({ action: 'wbgetentities', format: 'json', origin: '*', ids: match.id, props: 'claims' });
  const entityResponse = await fetch(`https://www.wikidata.org/w/api.php?${entityParameters}`);
  if (!entityResponse.ok) return undefined;
  const entities = await entityResponse.json() as WikidataEntities;
  const filename = entities.entities?.[match.id]?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
  return filename ? `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(filename)}?width=420` : undefined;
}

export async function loadPlayerImage(name: string, context = 'athlete') {
  const cacheKey = `${name}|${context}`;
  if (imageCache.has(cacheKey)) return imageCache.get(cacheKey) ?? undefined;
  try {
    const direct = new URLSearchParams({
      action: 'query', format: 'json', origin: '*', redirects: '1', prop: 'pageimages',
      piprop: 'thumbnail', pithumbsize: '420', pilicense: 'any', titles: name,
    });
    let source = await requestImage(direct);
    if (!source) {
      const search = new URLSearchParams({
        action: 'query', format: 'json', origin: '*', generator: 'search',
        gsrsearch: `"${name}" ${context}`, gsrnamespace: '0', gsrlimit: '5', prop: 'pageimages',
        piprop: 'thumbnail', pithumbsize: '420', pilicense: 'any',
      });
      source = await requestImage(search);
    }
    if (!source) source = await requestWikidataImage(name);
    imageCache.set(cacheKey, source ?? null);
    return source;
  } catch {
    imageCache.set(cacheKey, null);
    return undefined;
  }
}
