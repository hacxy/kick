import { existsSync } from 'node:fs';
import { cp, rm } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

export function getCacheDir(): string {
  return join(homedir(), '.fe', 'cache');
}

export function getTemplateCacheDir(templateName: string): string {
  return join(getCacheDir(), templateName);
}

export function hasCache(templateName: string): boolean {
  return existsSync(getTemplateCacheDir(templateName));
}

export async function clearTemplateCache(templateName: string): Promise<void> {
  const dir = getTemplateCacheDir(templateName);
  if (existsSync(dir)) {
    await rm(dir, { recursive: true, force: true });
  }
}

export async function copyFromCache(templateName: string, dest: string): Promise<void> {
  const src = getTemplateCacheDir(templateName);
  await cp(src, dest, { recursive: true });
}

export async function saveToCache(templateName: string, src: string): Promise<void> {
  const dest = getTemplateCacheDir(templateName);
  await clearTemplateCache(templateName);
  await cp(src, dest, { recursive: true });
}
