// lrclib.net: free, open, machine-friendly lyrics API (MIT-licensed server,
// community-contributed lyrics DB). No API key required. Chosen over
// lyrics.ovh/Deezer because it has meaningfully better coverage of
// regional-language and older-catalog songs -- Deezer's search (previously
// used here) returns confidently wrong top results for many Kannada/older
// Hindi queries (e.g. "mungaru male" matched a Verdi opera recording),
// silently poisoning the whole pipeline before lyrics were ever fetched.
const LRCLIB_BASE = 'https://lrclib.net/api'

// lrclib has no thumbnail/album art in its API, so search results carry no
// thumbnail (SearchBar renders a placeholder box in that case).
export async function searchTracks(query, limit = 5) {
  const res = await fetch(`${LRCLIB_BASE}/search?track_name=${encodeURIComponent(query)}`)
  if (!res.ok) {
    throw new Error('Search failed')
  }

  const results = await res.json()
  return results.slice(0, limit).map((track) => ({
    id: track.id,
    artist: track.artistName,
    title: track.trackName,
    thumbnail: null,
  }))
}

export async function fetchLyrics(artist, title) {
  // Try an exact match first.
  const getUrl = `${LRCLIB_BASE}/get?track_name=${encodeURIComponent(title)}&artist_name=${encodeURIComponent(artist)}`
  const getRes = await fetch(getUrl)
  if (getRes.ok) {
    const track = await getRes.json()
    if (track.plainLyrics) {
      return track.plainLyrics.trim()
    }
  }

  // Fall back to search when there's no exact match (e.g. slightly
  // different title/artist spelling).
  const searchUrl = `${LRCLIB_BASE}/search?track_name=${encodeURIComponent(title)}&artist_name=${encodeURIComponent(artist)}`
  const searchRes = await fetch(searchUrl)
  if (!searchRes.ok) {
    throw new Error('Lyrics not found')
  }

  const results = await searchRes.json()
  const match = results.find((r) => r.plainLyrics)
  if (!match) {
    throw new Error('Lyrics not found')
  }

  return match.plainLyrics.trim()
}
