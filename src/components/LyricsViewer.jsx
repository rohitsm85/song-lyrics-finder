function LyricsViewer({ song, isLoading, error }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-charcoal-900 p-6 min-h-[24rem]">
      {isLoading && (
        <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-gray-400">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-500" />
          <p>Searching for lyrics...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="flex h-full flex-col items-center justify-center gap-2 py-16 text-center">
          <p className="text-lg font-medium text-gray-200">No lyrics found</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      )}

      {!isLoading && !error && !song && (
        <div className="flex h-full flex-col items-center justify-center py-16 text-center">
          <p className="text-gray-500">Search for a song to display lyrics...</p>
        </div>
      )}

      {!isLoading && !error && song && (
        <div>
          <h2 className="text-xl font-semibold text-gray-100">{song.title}</h2>
          <p className="mb-4 text-sm text-indigo-400">{song.artist}</p>
          <pre className="whitespace-pre-wrap break-words font-sans text-gray-300 leading-relaxed">
            {song.lyrics}
          </pre>
        </div>
      )}
    </div>
  )
}

export default LyricsViewer
