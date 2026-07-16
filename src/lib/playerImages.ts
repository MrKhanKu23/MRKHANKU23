const imageCache = new Map<string, string | null>();

type PageImage = { thumbnail?: { source?: string } };
type PageImageResponse = { query?: { pages?: Record<string, PageImage> } };

async function requestImage(parameters: URLSearchParams) {
  const response = await fetch(`https://en.wikipedia.org/w/api.php?${parameters}`);
  if (!response.ok) return undefined;
  const result = await response.json() as PageImageResponse;
  return Object.values(result.query?.pages ?? {}).find((page) => page.thumbnail?.source)?.thumbnail?.source;
}

export async function loadPlayerImage(name: string) {
  if (imageCache.has(name)) return imageCache.get(name) ?? undefined;
  try {
    const direct = new URLSearchParams({
      action: 'query', format: 'json', origin: '*', redirects: '1', prop: 'pageimages',
      piprop: 'thumbnail', pithumbsize: '420', pilicense: 'any', titles: name,
    });
    let source = await requestImage(direct);
    if (!source) {
      const search = new URLSearchParams({
        action: 'query', format: 'json', origin: '*', generator: 'search',
        gsrsearch: `${name} athlete`, gsrnamespace: '0', gsrlimit: '5', prop: 'pageimages',
        piprop: 'thumbnail', pithumbsize: '420', pilicense: 'any',
      });
      source = await requestImage(search);
    }
    imageCache.set(name, source ?? null);
    return source;
  } catch {
    imageCache.set(name, null);
    return undefined;
  }
}
