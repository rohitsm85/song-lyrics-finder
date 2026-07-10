import { describe, expect, it } from 'vitest'
import { findMockMatches } from './mockSearch'

describe('findMockMatches', () => {
  it('matches by partial, case-insensitive title', () => {
    const results = findMockMatches('paper constel')
    expect(results).toHaveLength(1)
    expect(results[0].title).toBe('Paper Constellations')
  })

  it('matches by partial, case-insensitive artist', () => {
    const results = findMockMatches('wren')
    expect(results).toHaveLength(1)
    expect(results[0].artist).toBe('Wren Calloway')
  })

  it('is case-insensitive', () => {
    const results = findMockMatches('TUESDAY')
    expect(results).toHaveLength(1)
    expect(results[0].title).toBe("Tuesday's Ghost")
  })

  it('returns an empty array when nothing matches', () => {
    expect(findMockMatches('this song does not exist')).toEqual([])
  })

  it('respects the limit parameter', () => {
    const results = findMockMatches('a', 2)
    expect(results.length).toBeLessThanOrEqual(2)
  })
})
