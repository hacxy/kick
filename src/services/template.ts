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

export async function fetchTemplates(): Promise<Template[]> {
  const res = await fetch(INDEX_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch template index: ${res.status} ${res.statusText}`);
  }
  const data: TemplateIndex = await res.json();
  return data.templates;
}
