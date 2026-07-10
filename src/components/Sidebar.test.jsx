import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Sidebar from './Sidebar'

const songs = [
  { id: 1, title: 'Paper Constellations', artist: 'The Midnight Static' },
  { id: 2, title: 'Gravity Optional', artist: 'Wren Calloway' },
]

describe('Sidebar', () => {
  it('shows an empty state when there is no history', () => {
    render(<Sidebar history={[]} onSelect={vi.fn()} onClear={vi.fn()} />)
    expect(screen.getByText('No searches yet')).toBeInTheDocument()
    expect(screen.queryByText('Clear')).not.toBeInTheDocument()
  })

  it('lists history entries and calls onSelect when clicked', async () => {
    const onSelect = vi.fn()
    render(<Sidebar history={songs} onSelect={onSelect} onClear={vi.fn()} />)

    expect(screen.getByText('Paper Constellations')).toBeInTheDocument()
    expect(screen.getByText('Gravity Optional')).toBeInTheDocument()

    await userEvent.click(screen.getByText('Paper Constellations'))
    expect(onSelect).toHaveBeenCalledWith(songs[0])
  })

  it('calls onClear when Clear is clicked', async () => {
    const onClear = vi.fn()
    render(<Sidebar history={songs} onSelect={vi.fn()} onClear={onClear} />)

    await userEvent.click(screen.getByText('Clear'))
    expect(onClear).toHaveBeenCalledTimes(1)
  })
})
