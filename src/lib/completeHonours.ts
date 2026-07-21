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
  headings.filter((heading) => /honours|honors|awards/i.test(heading.textContent ?? '')).forEach((heading) => {
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

function isWonTrophy(value: string) {
  const trophy = /champion|championship|cup|copa|league|premiership|serie a|bundesliga|la liga|ligue 1|eredivisie|shield|trophy|medal|award|mvp|ballon|golden|olympic|grand slam|world series|super bowl|cy young|silver slugger|gold glove|rookie of the year|player of the year|open title|masters title|wimbledon|roland-garros|fncs|major title|tournament win|invitational win|grand prix win|race win|constructors|drivers/i;
  const notWon = /runner-up|runners-up|finalist|semi-final|semifinal|second place|third place|record holder|all-time record|appearance/i;
  return trophy.test(value) && !notWon.test(value);
}

function honourKey(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/uefa champions league\s*\/\s*european cup/g, 'uefa champions league')
    .split(/[:;—–]|\s-\s/)[0]
    .replace(/european cup/g, 'champions league')
    .replace(/\b(titles?|wins?|winners?|awards?|medals?)\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ').trim();
}

export function dedupeHonours(values: string[]) {
  const unique = new Map<string, string>();
  values.forEach((value) => {
    const key = honourKey(value);
    if (!key) return;
    const existing = unique.get(key);
    if (!existing || value.length > existing.length) unique.set(key, value);
  });
  return [...unique.values()];
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
    const combined = dedupeHonours([...known, ...expanded]);
    const honours = combined.filter(isWonTrophy);
    cache.set(key, honours);
    return honours;
  } catch {
    return dedupeHonours(known.filter(isWonTrophy));
  }
}
