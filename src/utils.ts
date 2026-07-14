import { existsSync } from 'node:fs';
import { readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

export function resolveProjectPath(projectName: string): string {
  if (projectName === '.' || projectName === './') {
    return process.cwd();
  }
  return join(process.cwd(), projectName);
}

export function getVisibleProjectName(projectName: string): string {
  if (projectName === '.' || projectName === './') {
    return process.cwd().split(/[\\/]/).pop() || 'project';
  }
  return projectName;
}

export async function isDirEmpty(dir: string): Promise<boolean> {
  if (!existsSync(dir)) return true;
  const files = await readdir(dir);
  return files.length === 0;
}

export async function emptyDir(dir: string): Promise<void> {
  const files = await readdir(dir);
  await Promise.all(
    files.map(file => rm(join(dir, file), { recursive: true, force: true })),
  );
}

export async function renameInDir(dir: string, from: string, to: string): Promise<void> {
  const { rename } = await import('node:fs/promises');
  const src = join(dir, from);
  const dest = join(dir, to);
  if (existsSync(src)) {
    await rename(src, dest);
  }
}

export async function updatePackageName(dir: string, name: string): Promise<void> {
  const { readFile, writeFile } = await import('node:fs/promises');
  const pkgPath = join(dir, 'package.json');
  if (!existsSync(pkgPath)) return;

  const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));
  pkg.name = name;
  await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
}
