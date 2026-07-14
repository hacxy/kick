import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createProject } from '../../src/commands/new.js';
import { downloadTemplate } from '../../src/services/download.js';

// Mock dependencies
vi.mock('chalk', () => ({
  default: {
    red: vi.fn(text => text),
    gray: vi.fn(text => text),
    cyan: vi.fn(text => text),
    green: vi.fn(text => text),
    bold: vi.fn(text => text),
    yellow: vi.fn(text => text),
  },
}));

vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn(),
  },
}));

vi.mock('ora', () => ({
  default: vi.fn().mockReturnValue({
    start: vi.fn().mockReturnValue({
      succeed: vi.fn(),
      fail: vi.fn(),
      warn: vi.fn(),
    }),
  }),
}));

vi.mock('../../src/services/cache.js', () => ({
  hasCache: vi.fn(),
  copyFromCache: vi.fn(),
  clearTemplateCache: vi.fn(),
  saveToCache: vi.fn(),
}));

vi.mock('../../src/services/download.js', () => ({
  downloadTemplate: vi.fn(),
}));

vi.mock('../../src/services/template.js', () => ({
  fetchTemplates: vi.fn(),
}));

vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
}));

vi.mock('../../src/utils.js', () => ({
  resolveProjectPath: vi.fn(),
  getVisibleProjectName: vi.fn(),
  isDirEmpty: vi.fn(),
  emptyDir: vi.fn(),
  renameInDir: vi.fn(),
  updatePackageName: vi.fn(),
}));

describe('createProject', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create project successfully', async () => {
    const mockTemplates = [
      { name: 'template1', description: 'Test template 1', repo: 'user/template1', category: 'web' },
    ];

    const { fetchTemplates } = await import('../../src/services/template.js');
    vi.mocked(fetchTemplates).mockResolvedValue(mockTemplates);

    const inquirer = await import('inquirer');
    vi.mocked(inquirer.default.prompt)
      .mockResolvedValueOnce({ category: 'web' })
      .mockResolvedValueOnce({ template: mockTemplates[0] })
      .mockResolvedValueOnce({ projectName: 'my-project' });

    const { existsSync } = await import('node:fs');
    vi.mocked(existsSync).mockReturnValue(true);

    const { resolveProjectPath, getVisibleProjectName, isDirEmpty, renameInDir, updatePackageName } = await import('../../src/utils.js');
    vi.mocked(resolveProjectPath).mockReturnValue('/test/my-project');
    vi.mocked(getVisibleProjectName).mockReturnValue('my-project');
    vi.mocked(isDirEmpty).mockResolvedValue(true);
    vi.mocked(renameInDir).mockResolvedValue(void 0);
    vi.mocked(updatePackageName).mockResolvedValue(void 0);

    const { hasCache } = await import('../../src/services/cache.js');
    vi.mocked(hasCache).mockReturnValue(false);

    const { downloadTemplate } = await import('../../src/services/download.js');
    vi.mocked(downloadTemplate).mockResolvedValue(void 0);

    const { saveToCache } = await import('../../src/services/cache.js');
    vi.mocked(saveToCache).mockResolvedValue(void 0);

    await createProject(void 0, {});

    expect(fetchTemplates).toHaveBeenCalled();
    expect(inquirer.default.prompt).toHaveBeenCalledTimes(3);
    expect(resolveProjectPath).toHaveBeenCalledWith('my-project');
    expect(getVisibleProjectName).toHaveBeenCalledWith('my-project');
    expect(isDirEmpty).toHaveBeenCalledWith('/test/my-project');
    expect(downloadTemplate).toHaveBeenCalledWith('user/template1', '/test/my-project');
    expect(saveToCache).toHaveBeenCalledWith('template1', '/test/my-project');
    expect(renameInDir).toHaveBeenCalledTimes(3);
    expect(updatePackageName).toHaveBeenCalledWith('/test/my-project', 'my-project');
  });

  it('should use template from options if provided', async () => {
    const mockTemplates = [
      { name: 'template1', description: 'Test template 1', repo: 'user/template1', category: 'web' },
    ];

    const { fetchTemplates } = await import('../../src/services/template.js');
    vi.mocked(fetchTemplates).mockResolvedValue(mockTemplates);

    const inquirer = await import('inquirer');
    vi.mocked(inquirer.default.prompt)
      .mockResolvedValueOnce({ projectName: 'my-project' });

    const { resolveProjectPath, getVisibleProjectName, isDirEmpty, renameInDir, updatePackageName } = await import('../../src/utils.js');
    vi.mocked(resolveProjectPath).mockReturnValue('/test/my-project');
    vi.mocked(getVisibleProjectName).mockReturnValue('my-project');
    vi.mocked(isDirEmpty).mockResolvedValue(true);
    vi.mocked(renameInDir).mockResolvedValue(void 0);
    vi.mocked(updatePackageName).mockResolvedValue(void 0);

    const { hasCache } = await import('../../src/services/cache.js');
    vi.mocked(hasCache).mockReturnValue(false);

    const { downloadTemplate } = await import('../../src/services/download.js');
    vi.mocked(downloadTemplate).mockResolvedValue(void 0);

    const { saveToCache } = await import('../../src/services/cache.js');
    vi.mocked(saveToCache).mockResolvedValue(void 0);

    await createProject(void 0, { template: 'template1' });

    expect(fetchTemplates).toHaveBeenCalled();
    expect(inquirer.default.prompt).toHaveBeenCalledTimes(1);
    expect(downloadTemplate).toHaveBeenCalledWith('user/template1', '/test/my-project');
  });

  it('should use cache if available and not refreshing', async () => {
    const mockTemplates = [
      { name: 'template1', description: 'Test template 1', repo: 'user/template1', category: 'web' },
    ];

    const { fetchTemplates } = await import('../../src/services/template.js');
    vi.mocked(fetchTemplates).mockResolvedValue(mockTemplates);

    const inquirer = await import('inquirer');
    vi.mocked(inquirer.default.prompt)
      .mockResolvedValueOnce({ projectName: 'my-project' });

    const { resolveProjectPath, getVisibleProjectName, isDirEmpty, renameInDir, updatePackageName } = await import('../../src/utils.js');
    vi.mocked(resolveProjectPath).mockReturnValue('/test/my-project');
    vi.mocked(getVisibleProjectName).mockReturnValue('my-project');
    vi.mocked(isDirEmpty).mockResolvedValue(true);
    vi.mocked(renameInDir).mockResolvedValue(void 0);
    vi.mocked(updatePackageName).mockResolvedValue(void 0);

    const { hasCache, copyFromCache } = await import('../../src/services/cache.js');
    vi.mocked(hasCache).mockReturnValue(true);
    vi.mocked(copyFromCache).mockResolvedValue(void 0);

    await createProject(void 0, { template: 'template1' });

    expect(fetchTemplates).toHaveBeenCalled();
    expect(hasCache).toHaveBeenCalledWith('template1');
    expect(copyFromCache).toHaveBeenCalledWith('template1', '/test/my-project');
    expect(downloadTemplate).not.toHaveBeenCalled();
  });

  it('should download template if refresh is true', async () => {
    const mockTemplates = [
      { name: 'template1', description: 'Test template 1', repo: 'user/template1', category: 'web' },
    ];

    const { fetchTemplates } = await import('../../src/services/template.js');
    vi.mocked(fetchTemplates).mockResolvedValue(mockTemplates);

    const inquirer = await import('inquirer');
    vi.mocked(inquirer.default.prompt)
      .mockResolvedValueOnce({ projectName: 'my-project' });

    const { resolveProjectPath, getVisibleProjectName, isDirEmpty, renameInDir, updatePackageName } = await import('../../src/utils.js');
    vi.mocked(resolveProjectPath).mockReturnValue('/test/my-project');
    vi.mocked(getVisibleProjectName).mockReturnValue('my-project');
    vi.mocked(isDirEmpty).mockResolvedValue(true);
    vi.mocked(renameInDir).mockResolvedValue(void 0);
    vi.mocked(updatePackageName).mockResolvedValue(void 0);

    const { hasCache } = await import('../../src/services/cache.js');
    vi.mocked(hasCache).mockReturnValue(true);

    const { downloadTemplate } = await import('../../src/services/download.js');
    vi.mocked(downloadTemplate).mockResolvedValue(void 0);

    const { saveToCache } = await import('../../src/services/cache.js');
    vi.mocked(saveToCache).mockResolvedValue(void 0);

    await createProject(void 0, { template: 'template1', refresh: true });

    expect(fetchTemplates).toHaveBeenCalled();
    expect(hasCache).not.toHaveBeenCalled();
    expect(downloadTemplate).toHaveBeenCalledWith('user/template1', '/test/my-project');
    expect(saveToCache).toHaveBeenCalledWith('template1', '/test/my-project');
  });

  it('should exit if template not found', async () => {
    const mockTemplates = [
      { name: 'template1', description: 'Test template 1', repo: 'user/template1', category: 'web' },
    ];

    const { fetchTemplates } = await import('../../src/services/template.js');
    vi.mocked(fetchTemplates).mockResolvedValue(mockTemplates);

    const inquirer = await import('inquirer');
    vi.mocked(inquirer.default.prompt).mockResolvedValue({ projectName: 'my-project' });

    const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => void 0 as never);

    await createProject(void 0, { template: 'nonexistent' });

    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('should exit if fetch templates fails', async () => {
    const { fetchTemplates } = await import('../../src/services/template.js');
    vi.mocked(fetchTemplates).mockRejectedValue(new Error('Network error'));

    const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => void 0 as never);

    // The function will throw because process.exit is mocked and doesn't actually exit
    // We need to catch the error to prevent the test from failing
    try {
      await createProject(void 0, {});
    }
    catch {
      // Expected error because process.exit doesn't actually exit in tests
    }

    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
