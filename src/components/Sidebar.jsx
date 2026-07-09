function Sidebar({ history, onSelect, onClear }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-charcoal-900 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Recent Searches
        </h3>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-gray-500 transition-colors hover:text-indigo-400"
          >
            Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-sm text-gray-600">No searches yet</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {history.map((song) => (
            <li key={song.id}>
              <button
                onClick={() => onSelect(song)}
                className="w-full rounded-xl px-3 py-2 text-left transition-colors
                           hover:bg-charcoal-700"
              >
                <p className="truncate text-sm text-gray-200">{song.title}</p>
                <p className="truncate text-xs text-gray-500">{song.artist}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Sidebar
