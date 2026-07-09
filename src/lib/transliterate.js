import Sanscript from '@indic-transliteration/sanscript'

// Best-effort phonetic transliteration of romanized lyrics into native
// Indic scripts. Input is assumed to be casual ITRANS-like romanization
// (e.g. lyrics.ovh results), so output is approximate, not authoritative.
export const SCRIPTS = [
  { code: 'roman', label: 'Roman' },
  { code: 'devanagari', label: 'Devanagari (Hindi)' },
  { code: 'kannada', label: 'Kannada' },
]

export function transliterate(text, scriptCode) {
  if (scriptCode === 'roman') return text
  return Sanscript.t(text, 'itrans', scriptCode)
}
