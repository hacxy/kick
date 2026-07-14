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

  it('should retry on failure and succeed', async () => {
    const mockTemplates = [
      { name: 'template1', description: 'Test template 1', repo: 'user/template1', category: 'web' },
    ];

    const failResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    };

    const successResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ templates: mockTemplates }),
    };

    const fetchMock = vi.fn()
      .mockResolvedValueOnce(failResponse)
      .mockResolvedValueOnce(successResponse);

    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchTemplates();

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(result).toEqual(mockTemplates);
  });

  it('should throw error after all retries fail', async () => {
    const failResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(failResponse));

    await expect(fetchTemplates()).rejects.toThrow('Failed to fetch after 3 retries');
  }, 10000);
});
