import { useState } from 'react'

function SearchBar({ query, onQueryChange, onSubmit, suggestions, onPickSuggestion, isLoading }) {
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    setIsFocused(false)
    onSubmit(trimmed)
  }

  const handlePick = (item) => {
    setIsFocused(false)
    onPickSuggestion(item)
  }

  const showDropdown = isFocused && suggestions.length > 0

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          onKeyDown={(e) => e.key === 'Escape' && setIsFocused(false)}
          placeholder="Search by song title or artist..."
          className="flex-1 rounded-2xl border border-white/10 bg-charcoal-800 px-4 py-2.5
                     text-gray-100 placeholder-gray-500 outline-none
                     focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/30"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="rounded-2xl bg-indigo-600 px-5 py-2.5 font-medium text-white
                     transition-colors hover:bg-indigo-500
                     disabled:cursor-not-allowed disabled:bg-indigo-600/40"
        >
          Search
        </button>
      </form>

      {showDropdown && (
        <ul
          className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border
                     border-white/10 bg-charcoal-800 shadow-xl"
        >
          {suggestions.map((item) => (
            <li key={item.key}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handlePick(item)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left
                           transition-colors hover:bg-charcoal-700"
              >
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="h-9 w-9 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-9 w-9 shrink-0 rounded-lg bg-charcoal-700" />
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm text-gray-200">{item.title}</p>
                  <p className="truncate text-xs text-gray-500">{item.artist}</p>
                </div>
                {item.source === 'offline' && (
                  <span className="ml-auto shrink-0 rounded-full bg-indigo-500/15 px-2 py-0.5 text-[10px] font-medium text-indigo-400">
                    offline
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchBar
