import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearTemplateCache, copyFromCache, getCacheDir, getTemplateCacheDir, hasCache, saveToCache } from '../../src/services/cache.js';

// Mock node:fs
vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
}));

// Mock node:fs/promises
vi.mock('node:fs/promises', () => ({
  cp: vi.fn(),
  rm: vi.fn(),
}));

// Mock node:os
vi.mock('node:os', () => ({
  homedir: vi.fn().mockReturnValue('/home/user'),
}));

describe('getCacheDir', () => {
  it('should return cache directory path', () => {
    const result = getCacheDir();
    expect(result).toBe('/home/user/.fe/cache');
  });
});

describe('getTemplateCacheDir', () => {
  it('should return template cache directory path', () => {
    const templateName = 'my-template';
    const result = getTemplateCacheDir(templateName);
    expect(result).toBe('/home/user/.fe/cache/my-template');
  });
});

describe('hasCache', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return true if cache exists', async () => {
    const { existsSync } = await import('node:fs');
    vi.mocked(existsSync).mockReturnValue(true);

    const result = hasCache('my-template');
    expect(result).toBe(true);
    expect(existsSync).toHaveBeenCalledWith('/home/user/.fe/cache/my-template');
  });

  it('should return false if cache does not exist', async () => {
    const { existsSync } = await import('node:fs');
    vi.mocked(existsSync).mockReturnValue(false);

    const result = hasCache('my-template');
    expect(result).toBe(false);
  });
});

describe('clearTemplateCache', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should remove cache directory if it exists', async () => {
    const { existsSync } = await import('node:fs');
    const { rm } = await import('node:fs/promises');
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(rm).mockResolvedValue(void 0);

    await clearTemplateCache('my-template');

    expect(rm).toHaveBeenCalledWith('/home/user/.fe/cache/my-template', { recursive: true, force: true });
  });

  it('should not remove cache directory if it does not exist', async () => {
    const { existsSync } = await import('node:fs');
    const { rm } = await import('node:fs/promises');
    vi.mocked(existsSync).mockReturnValue(false);

    await clearTemplateCache('my-template');

    expect(rm).not.toHaveBeenCalled();
  });
});

describe('copyFromCache', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should copy from cache to destination', async () => {
    const { cp } = await import('node:fs/promises');
    vi.mocked(cp).mockResolvedValue(void 0);

    await copyFromCache('my-template', '/dest/path');

    expect(cp).toHaveBeenCalledWith('/home/user/.fe/cache/my-template', '/dest/path', { recursive: true });
  });
});

describe('saveToCache', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should save to cache', async () => {
    const { existsSync } = await import('node:fs');
    const { cp } = await import('node:fs/promises');
    vi.mocked(existsSync).mockReturnValue(false);
    vi.mocked(cp).mockResolvedValue(void 0);

    await saveToCache('my-template', '/src/path');

    expect(cp).toHaveBeenCalledWith('/src/path', '/home/user/.fe/cache/my-template', { recursive: true });
  });
});
