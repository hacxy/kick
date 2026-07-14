import { ProxyAgent, fetch as undiciFetch } from 'undici';

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

function getProxyUrl(): string | undefined {
  return process.env.https_proxy
    || process.env.HTTPS_PROXY
    || process.env.http_proxy
    || process.env.HTTP_PROXY;
}

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  const proxyUrl = getProxyUrl();
  const dispatcher = proxyUrl ? new ProxyAgent(proxyUrl) : void 0;

  for (let i = 0; i < retries; i++) {
    try {
      const res = await undiciFetch(url, { dispatcher });
      if (res.ok) return res as unknown as Response;
    }
    catch (err) {
      if (i === retries - 1) throw err;
    }
    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
  }
  throw new Error(`Failed to fetch after ${retries} retries`);
}

export async function fetchTemplates(): Promise<Template[]> {
  console.log(`Fetching templates from: ${INDEX_URL}`);
  const proxyUrl = getProxyUrl();
  if (proxyUrl) {
    console.log(`Using proxy: ${proxyUrl}`);
  }
  const res = await fetchWithRetry(INDEX_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch template index: ${res.status} ${res.statusText}`);
  }
  const data: TemplateIndex = await res.json();
  return data.templates;
}
