import { beforeEach, describe, expect, it, vi } from 'vitest';
import { downloadTemplate, getRepoIdentifier } from '../../src/services/download.js';

// Mock degit
vi.mock('degit', () => {
  return {
    default: vi.fn().mockReturnValue({
      clone: vi.fn().mockResolvedValue(void 0),
    }),
  };
});

describe('getRepoIdentifier', () => {
  it('should return repo identifier as is', () => {
    const repo = 'user/repo';
    const result = getRepoIdentifier(repo);
    expect(result).toBe(repo);
  });
});

describe('downloadTemplate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should download template using degit', async () => {
    const degit = await import('degit');
    const mockClone = vi.fn().mockResolvedValue(void 0);
    vi.mocked(degit.default).mockReturnValue({ clone: mockClone } as any);

    await downloadTemplate('user/repo', '/dest/path');

    expect(degit.default).toHaveBeenCalledWith('user/repo', {
      cache: false,
      force: true,
      verbose: true,
    });
    expect(mockClone).toHaveBeenCalledWith('/dest/path');
  });

  it('should throw error if clone fails', async () => {
    const degit = await import('degit');
    const mockClone = vi.fn().mockRejectedValue(new Error('Clone failed'));
    vi.mocked(degit.default).mockReturnValue({ clone: mockClone } as any);

    await expect(downloadTemplate('user/repo', '/dest/path')).rejects.toThrow('Clone failed');
  });
});
