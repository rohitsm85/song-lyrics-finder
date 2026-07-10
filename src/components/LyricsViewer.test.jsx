import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import LyricsViewer from './LyricsViewer'

const song = { id: 1, title: 'Paper Constellations', artist: 'The Midnight Static', lyrics: 'Hum tere bin' }

describe('LyricsViewer', () => {
  it('shows the placeholder when nothing has been searched', () => {
    render(<LyricsViewer song={null} isLoading={false} error={null} />)
    expect(screen.getByText('Search for a song to display lyrics...')).toBeInTheDocument()
  })

  it('shows a loading state', () => {
    render(<LyricsViewer song={null} isLoading={true} error={null} />)
    expect(screen.getByText('Searching for lyrics...')).toBeInTheDocument()
  })

  it('shows an error state', () => {
    render(<LyricsViewer song={null} isLoading={false} error="No lyrics for this one" />)
    expect(screen.getByText('No lyrics found')).toBeInTheDocument()
    expect(screen.getByText('No lyrics for this one')).toBeInTheDocument()
  })

  it('renders the song title, artist, and lyrics', () => {
    render(<LyricsViewer song={song} isLoading={false} error={null} />)
    expect(screen.getByText('Paper Constellations')).toBeInTheDocument()
    expect(screen.getByText('The Midnight Static')).toBeInTheDocument()
    expect(screen.getByText('Hum tere bin')).toBeInTheDocument()
  })

  it('transliterates lyrics when a native script is selected', async () => {
    render(<LyricsViewer song={song} isLoading={false} error={null} />)
    await userEvent.click(screen.getByText('Devanagari (Hindi)'))
    expect(screen.queryByText('Hum tere bin')).not.toBeInTheDocument()
    expect(
      screen.getByText(/Approximate phonetic transliteration/),
    ).toBeInTheDocument()
  })

  it('resets to Roman script when the song changes', () => {
    const { rerender } = render(<LyricsViewer song={song} isLoading={false} error={null} />)
    const otherSong = { id: 2, title: 'Other Song', artist: 'Other Artist', lyrics: 'kuch nahi' }
    rerender(<LyricsViewer song={otherSong} isLoading={false} error={null} />)
    expect(screen.getByText('kuch nahi')).toBeInTheDocument()
  })
})
