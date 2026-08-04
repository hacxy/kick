/**
 * Smoke test: the extension registers its tool, command, and lifecycle
 * handlers when installed. Kept intentionally small — extend with real
 * behavior tests as the extension grows (see the pi-deepseek-cost project
 * for a full harness pattern with session entries and config mocking).
 */

import type { ExtensionAPI } from '@earendil-works/pi-coding-agent'

import { describe, expect, it } from 'vitest'

import installExtension from '../src/index'

interface MockApi {
  handlers: Record<string, Array<(...args: unknown[]) => unknown>>
  tools: Array<{ name: string }>
  commands: Array<{ name: string }>
}

function makeHarness(): MockApi {
  const api: MockApi = { handlers: {}, tools: [], commands: [] }
  const pi = {
    on: (name: string, handler: (...args: unknown[]) => unknown) => {
      ;(api.handlers[name] ??= []).push(handler)
    },
    registerTool: (opts: { name: string }) => api.tools.push({ name: opts.name }),
    registerCommand: (name: string) => api.commands.push({ name }),
  }
  installExtension(pi as unknown as ExtensionAPI)
  return api
}

describe('extension', () => {
  it('registers the hello tool and command', () => {
    const api = makeHarness()
    expect(api.tools.map((t) => t.name)).toContain('hello')
    expect(api.commands.map((c) => c.name)).toContain('hello')
  })
})
