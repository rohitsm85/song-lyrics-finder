// Live lyrics lookup via the free lyrics.ovh API. No API key required.
// Used as a fallback when a query doesn't match anything in mockLyrics.
const LYRICS_OVH_BASE = 'https://api.lyrics.ovh/v1'
const SUGGEST_BASE = 'https://api.lyrics.ovh/suggest'

// The lyrics endpoint needs an artist and a title as separate values, but
// the app only has a single free-text search box. The suggest endpoint
// (Deezer-backed) resolves free text into real artist/title candidates so
// the user can pick the right version instead of us guessing the top hit.
export async function searchTracks(query, limit = 5) {
  const res = await fetch(`${SUGGEST_BASE}/${encodeURIComponent(query)}`)
  if (!res.ok) {
    throw new Error('Search failed')
  }

  const data = await res.json()
  return (data.data ?? []).slice(0, limit).map((track) => ({
    id: track.id,
    artist: track.artist.name,
    title: track.title,
    thumbnail: track.album?.cover_small || track.artist?.picture_small || null,
  }))
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
