import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { fetchLyrics, searchTracks } from './lib/lyricsApi'

vi.mock('./lib/lyricsApi', () => ({
  fetchLyrics: vi.fn(),
  searchTracks: vi.fn(),
}))

async function search(query) {
  const input = screen.getByPlaceholderText(/search by song title/i)
  await userEvent.type(input, query)
  await userEvent.click(screen.getByRole('button', { name: 'Search' }))
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('finds an offline mock song instantly on submit', async () => {
    // searchTracks may still fire in the background for autocomplete
    // suggestions while typing; what matters is the submit path resolves
    // via the mock catalog rather than waiting on fetchLyrics.
    render(<App />)
    await search('Paper Constellations')

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Paper Constellations' })).toBeInTheDocument(),
    )
    expect(fetchLyrics).not.toHaveBeenCalled()
  })

  it('falls back to the live API and shows fetched lyrics', async () => {
    searchTracks.mockResolvedValue([{ id: 1, artist: 'Coldplay', title: 'Yellow', thumbnail: null }])
    fetchLyrics.mockResolvedValue('Look at the stars')

    render(<App />)
    await search('Yellow')

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Yellow' })).toBeInTheDocument(),
    )
    expect(screen.getByText('Look at the stars')).toBeInTheDocument()
  })

  it('shows a "no song found" error when the live search finds nothing', async () => {
    searchTracks.mockResolvedValue([])

    render(<App />)
    await search('asdkfjasdf1234')

    await waitFor(() =>
      expect(screen.getByText(/couldn't find any song matching/i)).toBeInTheDocument(),
    )
  })

  it('shows a "found but no lyrics" error when lyrics are unavailable', async () => {
    searchTracks.mockResolvedValue([{ id: 1, artist: 'S.P. Balasubrahmanyam', title: 'Kanasugarana Ondu', thumbnail: null }])
    fetchLyrics.mockRejectedValue(new Error('Lyrics not found'))

    render(<App />)
    await search('Kanasugarana Ondu')

    await waitFor(() =>
      expect(screen.getByText(/but no lyrics are available/i)).toBeInTheDocument(),
    )
  })

  it('persists search history to localStorage and reloads from the sidebar', async () => {
    render(<App />)
    await search('Paper Constellations')
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Paper Constellations' })).toBeInTheDocument(),
    )

    const stored = JSON.parse(localStorage.getItem('song-lyrics-finder:history'))
    expect(stored).toHaveLength(1)
    expect(stored[0].title).toBe('Paper Constellations')
  })
})
