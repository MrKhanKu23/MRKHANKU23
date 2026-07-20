const imageCache = new Map<string, string | null>();
const fortnitePortraits: Record<string, string> = {
  Peterbot: 'https://res.cloudinary.com/dv4oaw0wk/image/upload/f_auto,q_85,w_512/v1778624070/fncr/players/597b62cd-6ee4-46f3-808f-6d7e6cca13b9/avatars/2f5c8532-05eb-4364-ad57-57462a335ea2.jpg',
  Pollo: 'https://prosettings.net/wp-content/uploads/pollofn-220x220-fitcontain-q99-gb283-s1.png',
  Clix: 'https://res.cloudinary.com/dv4oaw0wk/image/upload/f_auto,q_85,w_512/v1780362935/fncr/players/358b5333-0947-4774-a300-a53dddb75211/avatars/94edffec-67ed-40f1-bce4-166797f14537.jpg',
  Bugha: 'https://fncomprankings.com/_next/image?q=85&url=%2Frankings-page-player-images%2FBugha.jpg&w=640',
  Aqua: 'https://fncomprankings.com/_next/image?q=85&url=%2Frankings-page-player-images%2FAqua.jpg&w=640',
  Queasy: 'https://fncomprankings.com/_next/image?q=85&url=%2Frankings-page-player-images%2FQueasy.jpg&w=640',
  Veno: 'https://fncomprankings.com/_next/image?q=85&url=%2Frankings-page-player-images%2FVeno.jpg&w=640',
  Kami: 'https://fncomprankings.com/_next/image?q=85&url=%2Frankings-page-player-images%2FKami.jpg&w=640',
  MrSavage: 'https://fncomprankings.com/_next/image?q=85&url=%2Frankings-page-player-images%2FMrSavage.jpg&w=640',
  Mongraal: 'https://fncomprankings.com/_next/image?q=85&url=%2Frankings-page-player-images%2FMongraal.jpg&w=640',
  Mitr0: 'https://fncomprankings.com/_next/image?q=85&url=%2Frankings-page-player-images%2FMitr0.jpg&w=640',
  Zayt: 'https://fncomprankings.com/_next/image?q=85&url=%2Frankings-page-player-images%2FZayt.jpg&w=640',
  Saf: 'https://fncomprankings.com/_next/image?q=85&url=%2Frankings-page-player-images%2FSaf.jpg&w=640',
};

export function hasVerifiedFortnitePortrait(name: string) {
  return Boolean(fortnitePortraits[name]);
}

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

export async function loadPlayerImage(name: string, context = 'athlete', requireContext = false) {
  const cacheKey = `${name}|${context}|${requireContext}`;
  if (imageCache.has(cacheKey)) return imageCache.get(cacheKey) ?? undefined;
  if (context === 'Fortnite player' && hasVerifiedFortnitePortrait(name)) {
    const source = fortnitePortraits[name];
    imageCache.set(cacheKey, source);
    return source;
  }
  try {
    let source: string | undefined;
    if (!requireContext) {
      const direct = new URLSearchParams({
        action: 'query', format: 'json', origin: '*', redirects: '1', prop: 'pageimages',
        piprop: 'thumbnail', pithumbsize: '420', pilicense: 'any', titles: name,
      });
      source = await requestImage(direct);
    }
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
