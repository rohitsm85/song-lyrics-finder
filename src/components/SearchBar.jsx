import { useState } from 'react'

function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    onSearch(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
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
  )
}

export default SearchBar
