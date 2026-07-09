// Live lyrics lookup via the free lyrics.ovh API. No API key required.
// Used as a fallback when a query doesn't match anything in mockLyrics.
const LYRICS_OVH_BASE = 'https://api.lyrics.ovh/v1'
const SUGGEST_BASE = 'https://api.lyrics.ovh/suggest'

// The lyrics endpoint needs an artist and a title as separate values, but
// the app only has a single free-text search box. The suggest endpoint
// (Deezer-backed) resolves free text into a real artist/title pair.
export async function searchTrack(query) {
  const res = await fetch(`${SUGGEST_BASE}/${encodeURIComponent(query)}`)
  if (!res.ok) {
    throw new Error('Search failed')
  }

  const data = await res.json()
  const track = data.data?.[0]
  if (!track) {
    throw new Error('No matching track found')
  }

  return { artist: track.artist.name, title: track.title }
}

export async function fetchLyrics(artist, title) {
  const url = `${LYRICS_OVH_BASE}/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error('Lyrics not found')
  }

  const data = await res.json()
  if (!data.lyrics) {
    throw new Error('Lyrics not found')
  }

  return data.lyrics.trim()
}
