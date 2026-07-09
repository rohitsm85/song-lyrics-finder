import { useEffect, useState } from 'react'
import { SCRIPTS, transliterate } from '../lib/transliterate'

function LyricsViewer({ song, isLoading, error }) {
  const [script, setScript] = useState('roman')

  // Reset to the original script whenever a different song loads.
  useEffect(() => {
    setScript('roman')
  }, [song?.id])

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
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-100">{song.title}</h2>
              <p className="text-sm text-indigo-400">{song.artist}</p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {SCRIPTS.map((s) => (
                <button
                  key={s.code}
                  onClick={() => setScript(s.code)}
                  className={`rounded-xl px-3 py-1 text-xs font-medium transition-colors ${
                    script === s.code
                      ? 'bg-indigo-600 text-white'
                      : 'bg-charcoal-700 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {script !== 'roman' && (
            <p className="mb-3 text-xs text-gray-500">
              Approximate phonetic transliteration — may not be linguistically exact.
            </p>
          )}

          <pre className="whitespace-pre-wrap break-words font-sans text-gray-300 leading-relaxed">
            {transliterate(song.lyrics, script)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default LyricsViewer
