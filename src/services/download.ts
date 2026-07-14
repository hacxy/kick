import degit from 'degit';

export function getRepoIdentifier(repo: string): string {
  return repo;
}

export async function downloadTemplate(repo: string, dest: string): Promise<void> {
  const emitter = degit(repo, {
    cache: false,
    force: true,
    verbose: true,
  });

  await emitter.clone(dest);
}
