import { join } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { emptyDir, getVisibleProjectName, isDirEmpty, renameInDir, resolveProjectPath, updatePackageName } from '../src/utils.js';

// Mock node:fs
vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
}));

// Mock node:fs/promises
vi.mock('node:fs/promises', () => ({
  readdir: vi.fn(),
  rm: vi.fn(),
  rename: vi.fn(),
  readFile: vi.fn(),
  writeFile: vi.fn(),
}));

describe('resolveProjectPath', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return current working directory for "."', () => {
    const result = resolveProjectPath('.');
    expect(result).toBe(process.cwd());
  });

  it('should return current working directory for "./"', () => {
    const result = resolveProjectPath('./');
    expect(result).toBe(process.cwd());
  });

  it('should join project name with current working directory', () => {
    const projectName = 'my-project';
    const result = resolveProjectPath(projectName);
    expect(result).toBe(join(process.cwd(), projectName));
  });
});

describe('getVisibleProjectName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return current directory name for "."', () => {
    const result = getVisibleProjectName('.');
    const expected = process.cwd().split(/[\\/]/).pop() || 'project';
    expect(result).toBe(expected);
  });

  it('should return current directory name for "./"', () => {
    const result = getVisibleProjectName('./');
    const expected = process.cwd().split(/[\\/]/).pop() || 'project';
    expect(result).toBe(expected);
  });

  it('should return project name as is for other inputs', () => {
    const projectName = 'my-project';
    const result = getVisibleProjectName(projectName);
    expect(result).toBe(projectName);
  });
});

describe('isDirEmpty', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return true if directory does not exist', async () => {
    const { existsSync } = await import('node:fs');
    vi.mocked(existsSync).mockReturnValue(false);

    const result = await isDirEmpty('/nonexistent');
    expect(result).toBe(true);
  });

  it('should return true if directory is empty', async () => {
    const { existsSync } = await import('node:fs');
    const { readdir } = await import('node:fs/promises');
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readdir).mockResolvedValue([]);

    const result = await isDirEmpty('/empty-dir');
    expect(result).toBe(true);
  });

  it('should return false if directory is not empty', async () => {
    const { existsSync } = await import('node:fs');
    const { readdir } = await import('node:fs/promises');
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readdir).mockResolvedValue(['file1', 'file2'] as any);

    const result = await isDirEmpty('/non-empty-dir');
    expect(result).toBe(false);
  });
});

describe('emptyDir', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should remove all files in directory', async () => {
    const { readdir, rm } = await import('node:fs/promises');
    vi.mocked(readdir).mockResolvedValue(['file1', 'file2'] as any);
    vi.mocked(rm).mockResolvedValue(void 0);

    await emptyDir('/test-dir');

    expect(rm).toHaveBeenCalledTimes(2);
    expect(rm).toHaveBeenCalledWith(expect.stringContaining('file1'), { recursive: true, force: true });
    expect(rm).toHaveBeenCalledWith(expect.stringContaining('file2'), { recursive: true, force: true });
  });
});

describe('renameInDir', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should rename file if source exists', async () => {
    const { existsSync } = await import('node:fs');
    const { rename } = await import('node:fs/promises');
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(rename).mockResolvedValue(void 0);

    await renameInDir('/test-dir', 'old.txt', 'new.txt');

    expect(rename).toHaveBeenCalledWith(
      expect.stringContaining('old.txt'),
      expect.stringContaining('new.txt'),
    );
  });

  it('should not rename file if source does not exist', async () => {
    const { existsSync } = await import('node:fs');
    const { rename } = await import('node:fs/promises');
    vi.mocked(existsSync).mockReturnValue(false);

    await renameInDir('/test-dir', 'old.txt', 'new.txt');

    expect(rename).not.toHaveBeenCalled();
  });
});

describe('updatePackageName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update package.json name if file exists', async () => {
    const { existsSync } = await import('node:fs');
    const { readFile, writeFile } = await import('node:fs/promises');
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFile).mockResolvedValue('{"name": "old-name", "version": "1.0.0"}');
    vi.mocked(writeFile).mockResolvedValue(void 0);

    await updatePackageName('/test-dir', 'new-name');

    expect(readFile).toHaveBeenCalledWith(expect.stringContaining('package.json'), 'utf-8');
    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('package.json'),
      expect.stringContaining('"name": "new-name"'),
    );
  });

  it('should not update package.json if file does not exist', async () => {
    const { existsSync } = await import('node:fs');
    const { readFile, writeFile } = await import('node:fs/promises');
    vi.mocked(existsSync).mockReturnValue(false);

    await updatePackageName('/test-dir', 'new-name');

    expect(readFile).not.toHaveBeenCalled();
    expect(writeFile).not.toHaveBeenCalled();
  });
});
