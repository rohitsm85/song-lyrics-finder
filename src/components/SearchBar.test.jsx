import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import SearchBar from './SearchBar'

const suggestions = [
  {
    key: 'mock-1',
    title: 'Paper Constellations',
    artist: 'The Midnight Static',
    thumbnail: null,
    source: 'offline',
  },
]

describe('SearchBar', () => {
  it('calls onQueryChange as the user types', async () => {
    const onQueryChange = vi.fn()
    render(
      <SearchBar
        query=""
        onQueryChange={onQueryChange}
        onSubmit={vi.fn()}
        suggestions={[]}
        onPickSuggestion={vi.fn()}
        isLoading={false}
      />,
    )

    await userEvent.type(screen.getByPlaceholderText(/search by song title/i), 'yellow')
    expect(onQueryChange).toHaveBeenCalled()
  })

  it('calls onSubmit with the trimmed query on submit', async () => {
    const onSubmit = vi.fn()
    render(
      <SearchBar
        query="  Yellow  "
        onQueryChange={vi.fn()}
        onSubmit={onSubmit}
        suggestions={[]}
        onPickSuggestion={vi.fn()}
        isLoading={false}
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Search' }))
    expect(onSubmit).toHaveBeenCalledWith('Yellow')
  })

  it('disables the Search button when the query is empty', () => {
    render(
      <SearchBar
        query=""
        onQueryChange={vi.fn()}
        onSubmit={vi.fn()}
        suggestions={[]}
        onPickSuggestion={vi.fn()}
        isLoading={false}
      />,
    )
    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled()
  })

  it('shows suggestions on focus and calls onPickSuggestion when one is clicked', async () => {
    const onPickSuggestion = vi.fn()
    render(
      <SearchBar
        query="paper"
        onQueryChange={vi.fn()}
        onSubmit={vi.fn()}
        suggestions={suggestions}
        onPickSuggestion={onPickSuggestion}
        isLoading={false}
      />,
    )

    await userEvent.click(screen.getByPlaceholderText(/search by song title/i))
    expect(screen.getByText('Paper Constellations')).toBeInTheDocument()

    await userEvent.click(screen.getByText('Paper Constellations'))
    expect(onPickSuggestion).toHaveBeenCalledWith(suggestions[0])
  })

  it('does not show the dropdown when unfocused', () => {
    render(
      <SearchBar
        query="paper"
        onQueryChange={vi.fn()}
        onSubmit={vi.fn()}
        suggestions={suggestions}
        onPickSuggestion={vi.fn()}
        isLoading={false}
      />,
    )
    expect(screen.queryByText('Paper Constellations')).not.toBeInTheDocument()
  })
})
