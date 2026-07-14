import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchTemplates } from '../../src/services/template.js';

describe('fetchTemplates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch templates successfully', async () => {
    const mockTemplates = [
      { name: 'template1', description: 'Test template 1', repo: 'user/template1', category: 'web' },
      { name: 'template2', description: 'Test template 2', repo: 'user/template2', category: 'mobile' },
    ];

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ templates: mockTemplates }),
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));

    const result = await fetchTemplates();

    expect(fetch).toHaveBeenCalledWith('https://raw.githubusercontent.com/hacxy/kick/main/templates.json');
    expect(result).toEqual(mockTemplates);
  });

  it('should throw error if fetch fails', async () => {
    const mockResponse = {
      ok: false,
      status: 404,
      statusText: 'Not Found',
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));

    await expect(fetchTemplates()).rejects.toThrow('Failed to fetch template index: 404 Not Found');
  });

  it('should throw error if response is not ok', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));

    await expect(fetchTemplates()).rejects.toThrow('Failed to fetch template index: 500 Internal Server Error');
  });
});
