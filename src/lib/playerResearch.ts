import { supabase } from './supabase';

type WikiPage = { title?: string; extract?: string };
type WikiResponse = { query?: { pages?: Record<string, WikiPage> } };
type AiResponse = { text?: string; error?: string };
export type FactFileResearch = { trophiesWon: string[] };

async function wikipediaContext(name: string, sport: string) {
  const parameters = new URLSearchParams({
    action: 'query', format: 'json', origin: '*', generator: 'search',
    gsrsearch: `"${name}" ${sport} player`, gsrnamespace: '0', gsrlimit: '1',
    prop: 'extracts', explaintext: '1', exintro: '1', exchars: '3000',
  });
  const response = await fetch(`https://en.wikipedia.org/w/api.php?${parameters}`);
  if (!response.ok) return '';
  const result = await response.json() as WikiResponse;
  const page = Object.values(result.query?.pages ?? {})[0];
  return page?.extract ? `Wikipedia page: ${page.title}\n${page.extract}` : '';
}

export async function researchPlayer(name: string, sport: string) {
  const source = await wikipediaContext(name, sport);
  const prompt = `List every competition, championship, trophy, medal and individual award actually won by "${name}" in ${sport}.

SOURCE CONTEXT:
${source || 'No matching Wikipedia summary was found.'}

Return only a bullet list of named wins. Include seasons or years when the source provides them. Exclude biography, teams, statistics, records, appearances, nominations, finalist results and runner-up finishes. If no wins can be verified, say "No verified wins found."`;
  const system = 'You are Sportify Trophy Research, a careful sports fact-checking assistant. Use only the supplied source context. Never invent a competition, trophy, date or award. List only wins. Do not include explanations or biographical information.';
  const { data, error } = await supabase.functions.invoke<AiResponse>('ai', { body: { prompt, system } });
  if (error) throw error;
  if (!data?.text) throw new Error(data?.error || 'The AI helper returned no information.');
  return data.text.trim();
}

function parseFactFile(text: string): FactFileResearch {
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const value = JSON.parse(cleaned) as { trophiesWon?: unknown };
  return {
    trophiesWon: Array.isArray(value.trophiesWon)
      ? value.trophiesWon.filter((item): item is string => typeof item === 'string' && item.trim().length > 2).map((item) => item.trim())
      : [],
  };
}

export async function researchFactFile(name: string, sport: string, kind: 'player' | 'team', knownHonours: string[]) {
  const source = await wikipediaContext(name, sport);
  const prompt = `Research this ${kind}: "${name}" (${sport}).

PUBLIC SOURCE:
${source || 'No matching Wikipedia summary was found.'}

COLLECTED HONOURS:
${knownHonours.length ? knownHonours.join('\n') : 'No honours collected yet.'}

Return only valid JSON in this exact shape:
{"trophiesWon":["exact competition, trophy, medal or individual award actually won, including season/year when supported"]}

Keep only championships, cups, medals, titles and individual awards actually won. Group repeat wins of the same trophy into one array item with all supported seasons, years or the total count. Never list the same trophy twice. Exclude records, appearances, finalist results, runner-up finishes and explanations.`;
  const system = 'You are Sportify Trophy Fact Checker. Use only the supplied public source and collected honours. Include every supported competition, championship, trophy, medal and individual award actually won. Group every repeated trophy into one item containing all supported seasons, years or its total count; never return duplicate trophies. Never add an unsupported win. Exclude records, appearances, nominations, finalist results, runner-up finishes and explanations. Output valid JSON only, without markdown.';
  const { data, error } = await supabase.functions.invoke<AiResponse>('ai', { body: { prompt, system } });
  if (error) throw error;
  if (!data?.text) throw new Error(data?.error || 'The AI helper returned no information.');
  return parseFactFile(data.text);
}
