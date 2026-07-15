const imageCache = new Map<string, string | null>();

type PageImage = { thumbnail?: { source?: string } };
type PageImageResponse = { query?: { pages?: Record<string, PageImage> } };

export async function loadPlayerImage(name: string) {
  if (imageCache.has(name)) return imageCache.get(name) ?? undefined;
  const parameters = new URLSearchParams({
    action: 'query', format: 'json', origin: '*', prop: 'pageimages',
    piprop: 'thumbnail', pithumbsize: '320', pilicense: 'free', titles: name,
  });
  try {
    const response = await fetch(`https://en.wikipedia.org/w/api.php?${parameters}`);
    if (!response.ok) throw new Error('Player image request failed');
    const result = await response.json() as PageImageResponse;
    const page = Object.values(result.query?.pages ?? {})[0];
    const source = page?.thumbnail?.source;
    imageCache.set(name, source ?? null);
    return source;
  } catch {
    imageCache.set(name, null);
    return undefined;
  }
}
