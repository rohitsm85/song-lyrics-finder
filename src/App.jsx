import { useEffect, useState } from 'react'
import SearchBar from './components/SearchBar'
import LyricsViewer from './components/LyricsViewer'
import Sidebar from './components/Sidebar'
import mockLyrics from './data/mockLyrics'
import { fetchLyrics, searchTrack } from './lib/lyricsApi'

const HISTORY_KEY = 'song-lyrics-finder:history'
const MAX_HISTORY = 8
const SIMULATED_DELAY_MS = 500

// Finds a song in the offline mock catalog by partial, case-insensitive
// match against title or artist.
function findMockMatch(query) {
  const q = query.toLowerCase()
  return mockLyrics.find(
    (song) =>
      song.title.toLowerCase().includes(q) || song.artist.toLowerCase().includes(q),
  )
}

function App() {
  const [currentSong, setCurrentSong] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])

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

  const addToHistory = (song) => {
    setHistory((prev) => {
      const withoutDupe = prev.filter((s) => s.id !== song.id)
      return [song, ...withoutDupe].slice(0, MAX_HISTORY)
    })
  }

  const handleSearch = async (query) => {
    setIsLoading(true)
    setError(null)

    // Simulate an async lookup so the loading state is visible even for
    // instant offline mock matches.
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))

    const mockMatch = findMockMatch(query)
    if (mockMatch) {
      setCurrentSong(mockMatch)
      addToHistory(mockMatch)
      setIsLoading(false)
      return
    }

    try {
      const { artist, title } = await searchTrack(query)
      const lyrics = await fetchLyrics(artist, title)
      const song = { id: `live-${artist}-${title}`.toLowerCase(), title, artist, lyrics }
      setCurrentSong(song)
      addToHistory(song)
    } catch {
      setCurrentSong(null)
      setError(`We couldn't find lyrics for "${query}". Try another title or artist.`)
    } finally {
      setIsLoading(false)
    }
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
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
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
