const cache = new Map<string, string[]>();
const api = 'https://en.wikipedia.org/w/api.php';

type SearchResponse = { query?: { search?: Array<{ title: string }> } };
type ParseResponse = { parse?: { text?: { '*': string } } };

async function wikipedia(parameters: URLSearchParams) {
  const response = await fetch(`${api}?${parameters}`);
  if (!response.ok) throw new Error('Wikipedia request failed');
  return response.json() as Promise<unknown>;
}

function extractHonours(html: string) {
  const document = new DOMParser().parseFromString(html, 'text/html');
  const headings = [...document.querySelectorAll('h2,h3')];
  const honours: string[] = [];
  headings.filter((heading) => /honours|honors|awards|achievements/i.test(heading.textContent ?? '')).forEach((heading) => {
    const level = Number(heading.tagName.slice(1));
    let sibling = heading.nextElementSibling;
    while (sibling && (!/^H[23]$/.test(sibling.tagName) || Number(sibling.tagName.slice(1)) > level)) {
      sibling.querySelectorAll('li').forEach((item) => {
        const value = item.textContent?.replace(/\[\d+\]/g, '').replace(/\s+/g, ' ').trim();
        if (value && value.length < 240) honours.push(value);
      });
      sibling = sibling.nextElementSibling;
    }
  });
  return [...new Set(honours)];
}

export async function loadCompleteHonours(name: string, sport: string, kind: 'player' | 'team', known: string[]) {
  const key = `${sport}:${kind}:${name}`;
  const saved = cache.get(key);
  if (saved) return saved;
  try {
    const searchParams = new URLSearchParams({ action: 'query', format: 'json', origin: '*', list: 'search', srsearch: `"${name}" ${sport}`, srlimit: '1' });
    const search = await wikipedia(searchParams) as SearchResponse;
    const title = search.query?.search?.[0]?.title ?? name;
    const parseParams = new URLSearchParams({ action: 'parse', format: 'json', origin: '*', redirects: '1', prop: 'text', page: title });
    const parsed = await wikipedia(parseParams) as ParseResponse;
    const expanded = extractHonours(parsed.parse?.text?.['*'] ?? '');
    const honours = [...new Set([...known, ...expanded])];
    cache.set(key, honours);
    return honours;
  } catch {
    return known;
  }
}
