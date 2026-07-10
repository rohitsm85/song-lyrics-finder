import { useEffect, useRef, useState } from 'react'
import SearchBar from './components/SearchBar'
import LyricsViewer from './components/LyricsViewer'
import Sidebar from './components/Sidebar'
import { fetchLyrics, searchTracks } from './lib/lyricsApi'
import { findMockMatches } from './lib/mockSearch'

const HISTORY_KEY = 'song-lyrics-finder:history'
const MAX_HISTORY = 8
const SIMULATED_DELAY_MS = 500
const SUGGEST_DEBOUNCE_MS = 300
const MIN_SUGGEST_LENGTH = 2

function App() {
  const [currentSong, setCurrentSong] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const latestQueryRef = useRef('')

  // Load saved search history on first mount.
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY)
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch {
        setHistory([])
      }
    }
  }, [])

  // Persist history whenever it changes.
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  }, [history])

  // Debounced autocomplete: mock matches show instantly, live matches
  // (with thumbnails) arrive shortly after via the suggest API.
  useEffect(() => {
    const trimmed = query.trim()
    latestQueryRef.current = trimmed

    if (trimmed.length < MIN_SUGGEST_LENGTH) {
      setSuggestions([])
      return
    }

    const mockItems = findMockMatches(trimmed).map((song) => ({
      key: `mock-${song.id}`,
      title: song.title,
      artist: song.artist,
      thumbnail: null,
      source: 'offline',
      payload: song,
    }))
    setSuggestions(mockItems)

    const timer = setTimeout(async () => {
      try {
        const tracks = await searchTracks(trimmed, 5)
        if (latestQueryRef.current !== trimmed) return // query changed since this fired
        const liveItems = tracks.map((track) => ({
          key: `live-${track.id}`,
          title: track.title,
          artist: track.artist,
          thumbnail: track.thumbnail,
          source: 'live',
          payload: track,
        }))
        setSuggestions([...mockItems, ...liveItems])
      } catch {
        // Suggestion fetch failing is non-fatal; plain submit still works.
      }
    }, SUGGEST_DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [query])

  const addToHistory = (song) => {
    setHistory((prev) => {
      const withoutDupe = prev.filter((s) => s.id !== song.id)
      return [song, ...withoutDupe].slice(0, MAX_HISTORY)
    })
  }

  // Fetches lyrics for a specific artist/title pair and commits the result
  // (or a "found the song, no lyrics" error) to state. Caller manages
  // isLoading and the simulated delay.
  const commitLiveTrack = async (track) => {
    try {
      const lyrics = await fetchLyrics(track.artist, track.title)
      const song = {
        id: `live-${track.artist}-${track.title}`.toLowerCase(),
        title: track.title,
        artist: track.artist,
        lyrics,
      }
      setCurrentSong(song)
      addToHistory(song)
    } catch {
      setCurrentSong(null)
      setError(
        `Found "${track.title}" by ${track.artist}, but no lyrics are available for it. ` +
          'Our free lyrics source has limited coverage for regional-language and older songs.',
      )
    }
  }

  const handleSubmit = async (rawQuery) => {
    setSuggestions([])
    setIsLoading(true)
    setError(null)

    // Simulate an async lookup so the loading state is visible even for
    // instant offline mock matches.
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))

    const [mockMatch] = findMockMatches(rawQuery, 1)
    if (mockMatch) {
      setCurrentSong(mockMatch)
      addToHistory(mockMatch)
      setIsLoading(false)
      return
    }

    try {
      const [topTrack] = await searchTracks(rawQuery, 1)
      if (!topTrack) throw new Error('No matching track found')
      await commitLiveTrack(topTrack)
    } catch {
      setCurrentSong(null)
      setError(`We couldn't find any song matching "${rawQuery}". Try another title or artist.`)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePickSuggestion = async (item) => {
    setQuery(item.title)
    setSuggestions([])
    setError(null)

    if (item.source === 'offline') {
      setCurrentSong(item.payload)
      addToHistory(item.payload)
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))
    await commitLiveTrack(item.payload)
    setIsLoading(false)
  }

  const handleSelectHistory = (song) => {
    setError(null)
    setCurrentSong(song)
  }

  const handleClearHistory = () => {
    setHistory([])
  }

  return (
    <div className="min-h-screen bg-charcoal-950 text-gray-100">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Song Lyrics Finder</h1>
          <p className="mt-1 text-sm text-gray-500">
            Search a song title or artist to pull up the lyrics.
          </p>
        </header>

        <div className="mb-6">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            onSubmit={handleSubmit}
            suggestions={suggestions}
            onPickSuggestion={handlePickSuggestion}
            isLoading={isLoading}
          />
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <div className="md:order-1 md:flex-1">
            <LyricsViewer song={currentSong} isLoading={isLoading} error={error} />
          </div>
          <div className="md:order-2 md:w-72 md:shrink-0">
            <Sidebar
              history={history}
              onSelect={handleSelectHistory}
              onClear={handleClearHistory}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
