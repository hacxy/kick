import degit from 'degit';

export function getRepoIdentifier(repo: string): string {
  return repo;
}

export async function downloadTemplate(repo: string, dest: string): Promise<void> {
  const emitter = degit(repo, {
    cache: true,
    force: false,
    verbose: false,
  });

  await emitter.clone(dest);
}
