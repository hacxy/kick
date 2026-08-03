import type { Linter } from 'eslint'

export interface HacxyConfigOptions {
  react?: boolean
  vue?: boolean
  node?: boolean
  lib?: boolean
}

export declare function hacxy(options?: HacxyConfigOptions): Linter.Config[]

export default hacxy
