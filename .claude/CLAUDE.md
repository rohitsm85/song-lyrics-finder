CLAUDE.md
Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

Tradeoff: These guidelines bias toward caution over speed. For trivial tasks, use judgment.

1. Think Before Coding
Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

State your assumptions explicitly. If uncertain, ask.
If multiple interpretations exist, present them - don't pick silently.
If a simpler approach exists, say so. Push back when warranted.
If something is unclear, stop. Name what's confusing. Ask.
2. Simplicity First
Minimum code that solves the problem. Nothing speculative.

No features beyond what was asked.
No abstractions for single-use code.
No "flexibility" or "configurability" that wasn't requested.
No error handling for impossible scenarios.
If you write 200 lines and it could be 50, rewrite it.
Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

3. Surgical Changes
Touch only what you must. Clean up only your own mess.

When editing existing code:

Don't "improve" adjacent code, comments, or formatting.
Don't refactor things that aren't broken.
Match existing style, even if you'd do it differently.
If you notice unrelated dead code, mention it - don't delete it.
When your changes create orphans:

Remove imports/variables/functions that YOUR changes made unused.
Don't remove pre-existing dead code unless asked.
The test: Every changed line should trace directly to the user's request.

4. Goal-Driven Execution
Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

"Add validation" → "Write tests for invalid inputs, then make them pass"
"Fix the bug" → "Write a test that reproduces it, then make it pass"
"Refactor X" → "Ensure tests pass before and after"
For multi-step tasks, state a brief plan:

1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

## Project Context: Song Lyrics Finder

Live app: https://lyricshudku.vercel.app
Repo: https://github.com/rohitsm85/song-lyrics-finder (private, `main` branch, trunk-based — every push auto-deploys via Vercel; GitHub Actions CI runs lint+test+build on push/PR but does not currently gate the deploy)

### Architecture
- React + Vite + Tailwind, dark theme. No backend — all API calls happen client-side.
- `src/data/mockLyrics.js`: curated offline catalog, original non-copyrighted demo songs + any regional/classic songs the user has manually supplied lyrics for. Always checked first (instant, reliable).
- `src/lib/lyricsApi.js`: live fallback when a search doesn't match the mock catalog. Uses Deezer's suggest endpoint (`api.lyrics.ovh/suggest`) for autocomplete candidates (has thumbnails), then fetches lyrics text (source is being migrated to lrclib.net — see below).
- `src/lib/transliterate.js`: optional Devanagari/Kannada script view for lyrics, via `@indic-transliteration/sanscript` (approximate, ITRANS-based phonetic transliteration — not linguistically exact).
- Tests: Vitest + React Testing Library, `npm test`. 24 tests covering SearchBar, LyricsViewer, Sidebar, mock matching, and App's search/history flow.

### Known limitation: regional & older-catalog lyrics coverage
lyrics.ovh (the original live source) has almost no coverage for regional-language (e.g. Kannada) or older (pre-1970s) Bollywood songs, even when the song itself is findable via search. This was investigated in depth:
- **Musixmatch API**: legitimate and strong regional coverage, but costs $50/mo for a commercial key — parked, not pursued further per user's call (2026-07-09).
- **Unofficial JioSaavn wrapper APIs**: checked the actual open-source code (`sumitkolhe/jiosaavn-api`) — it has no lyrics-fetching implementation at all despite exposing a `hasLyrics` metadata flag. Would require reverse-engineering JioSaavn's private internal API to actually get lyrics text — declined, same reasoning as declining to scrape Google/Smule (private/ToS-restricted systems, copyrighted content).
- **Google search scraping / Smule scraping**: explicitly declined — ToS violation, gets blocked fast, and doesn't solve the actual copyright issue since the lyrics text itself is still copyrighted regardless of source page.
- **lrclib.net** (found 2026-07-10): open-source (MIT-licensed server), explicitly positioned as "a completely free service for finding and contributing synchronized lyrics, with an easy-to-use and machine-friendly API." No API key, open CORS. Tested and confirmed to return full lyrics for cases that failed everywhere else: the 1955 Hindi classic "Mera Joota Hai Japani" and an obscure Kannada song ("Kanasugarana Ondu") both returned complete `plainLyrics`. This is the current best lead for fixing regional coverage — see git history around this date for integration status.

### Standing plan: manual mock catalog expansion
User will supply lyrics text (with title + artist) for specific regional/classic songs they care about; these get added directly to `mockLyrics.js` in the existing `{ id, title, artist, lyrics }` shape. This is deliberately manual/curated rather than scraped, to stay on the right side of copyright and ToS — see the coverage section above for why automated scraping routes were ruled out.

### Environment notes
- Dev machine: Windows, project lives on E:. C: drive has repeatedly filled to 0 bytes free, which broke npm/git/gh in non-obvious ways (e.g. `git status` failing with "No space left on device" due to pagefile pressure, not literal repo disk usage). If tools start failing with disk-space errors that don't make sense given where the project lives, check `df -h /c` first.
- `gh` and `vercel` CLIs are installed locally (gh via winget at `C:\Program Files\GitHub CLI`, vercel as a project devDependency — invoke via `./node_modules/.bin/vercel`, not global `npx vercel`, since global installs kept hitting the full C: drive).
- `gh`'s config dir is redirected off C: via `GH_CONFIG_DIR=E:\Technical stuff\.tmp_gh_config` (set this env var before any `gh` command in a fresh shell).