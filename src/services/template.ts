export interface Template {
  name: string
  description: string
  repo: string
  category: string
}

export interface TemplateIndex {
  templates: Template[]
}

const INDEX_URL = 'https://raw.githubusercontent.com/hacxy/kick/main/templates.json';

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res;
    }
    catch (err) {
      if (i === retries - 1) throw err;
    }
    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
  }
  throw new Error(`Failed to fetch after ${retries} retries`);
}

export async function fetchTemplates(): Promise<Template[]> {
  console.log(`Fetching templates from: ${INDEX_URL}`);
  const res = await fetchWithRetry(INDEX_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch template index: ${res.status} ${res.statusText}`);
  }
  const data: TemplateIndex = await res.json();
  return data.templates;
}
