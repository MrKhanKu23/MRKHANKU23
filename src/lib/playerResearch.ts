import { supabase } from './supabase';

type WikiPage = { title?: string; extract?: string };
type WikiResponse = { query?: { pages?: Record<string, WikiPage> } };
type AiResponse = { text?: string; error?: string };
export type FactFileResearch = { summary: string; trophiesWon: string[] };

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
  const prompt = `Create a fact file for "${name}" in ${sport}.

SOURCE CONTEXT:
${source || 'No matching Wikipedia summary was found.'}

Return: full name; nationality; active or retired; main position/event; career years; current team and joined year if active; former teams with years; trophies and individual awards actually won; key official career statistics. If the name is ambiguous or not a ${sport} player, say so. Mark current details that cannot be confirmed as "Needs current verification".`;
  const system = 'You are Sportify Research, a careful sports fact-checking assistant. Use the supplied source context as the factual basis. Never invent dates, teams, statistics, trophies, or awards. Do not describe finalist or runner-up finishes as trophies won. Clearly say when information is missing or uncertain. Use short labelled sections and bullet points. Do not use tables.';
  const { data, error } = await supabase.functions.invoke<AiResponse>('ai', { body: { prompt, system } });
  if (error) throw error;
  if (!data?.text) throw new Error(data?.error || 'The AI helper returned no information.');
  return data.text.trim();
}

function parseFactFile(text: string): FactFileResearch {
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const value = JSON.parse(cleaned) as { summary?: unknown; trophiesWon?: unknown };
  return {
    summary: typeof value.summary === 'string' ? value.summary.trim() : '',
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
{"summary":"2-3 concise factual sentences about identity, career/status and team or competition","trophiesWon":["exact trophy or individual award actually won"]}

Keep only championships, cups, medals, titles and individual awards actually won. Exclude records, appearances, finalist results, runner-up finishes and explanations.`;
  const system = 'You are Sportify Fact Checker. Use only the supplied public source and collected honours. Never add an unsupported fact or trophy. If evidence is missing, omit it. Current team claims must be marked as needing verification unless the source explicitly confirms them. Output valid JSON only, without markdown.';
  const { data, error } = await supabase.functions.invoke<AiResponse>('ai', { body: { prompt, system } });
  if (error) throw error;
  if (!data?.text) throw new Error(data?.error || 'The AI helper returned no information.');
  return parseFactFile(data.text);
}
