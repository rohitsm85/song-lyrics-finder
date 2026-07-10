import mockLyrics from '../data/mockLyrics'

// Finds songs in the offline mock catalog by partial, case-insensitive
// match against title or artist.
export function findMockMatches(query, limit = 3) {
  const q = query.toLowerCase()
  return mockLyrics
    .filter(
      (song) => song.title.toLowerCase().includes(q) || song.artist.toLowerCase().includes(q),
    )
    .slice(0, limit)
}
