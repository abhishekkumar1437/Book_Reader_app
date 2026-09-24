# Book Reader

Read your PDFs like a real hardcover book: two-page spreads, page curl and shadows, drag or swipe to turn pages, search, bookmarks, zoom, and a library that remembers where you stopped.

Everything runs locally. There is no cloud storage or account.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Adding books

Either drop a PDF onto the library page, or copy PDF files straight into the `books/` folder at the project root. The library lists whatever is in that folder and refreshes when you return to the tab.

Deleting a book from the library deletes the file from `books/`.

## Reading

| Action | How |
| --- | --- |
| Turn page | Arrow keys, Space, click a page, drag a page corner, swipe on touch |
| Jump to page | Type a number in the bottom bar, or drag the progress slider |
| Zoom | Mouse wheel, pinch, `+` / `-`, `0` to fit |
| Pan while zoomed | Drag the page |
| Search | `/` or the search icon |
| Bookmark | `B` |
| Contents | Shown when the PDF has an outline |
| Single page or book view | `L`, the page icon in the toolbar, or Settings → Layout (Auto / Single / Book) |
| Dark mode | `D` |
| Fullscreen | `F` |

The toolbar hides after a few seconds and returns when you move the mouse or tap.

Reading position, zoom, bookmarks and settings are stored in the browser (localStorage).

## Quiz

The Quiz section (top-right of the library, or the question-mark icon in the reader) runs exam-style practice sets: one question at a time, a question palette, flag for review, an optional countdown, and a results page with explanations. Attempts and unfinished exams are kept in the browser.

Sets are JSON files in `quizzes/`, one per set, 40 questions each. The file name is the set id. Format:

```json
{
  "title": "Indian Economy: Basics",
  "subject": "Economics",
  "topic": "What the set covers",
  "description": "Optional longer description",
  "timeLimitMinutes": 40,
  "createdAt": "2026-09-23",
  "questions": [
    {
      "id": "q1",
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "answer": 1,
      "explanation": "Optional, shown in the review"
    }
  ]
}
```

`answer` is the 0-based index of the correct option. Invalid files are skipped with a warning in the server log.

## Interview Prep

The Interview Prep section (third tab in the header) is a shelf of books for interview preparation. Each book is a card; opening it shows its chapters, and each chapter opens in a text reader (not the page-flip reader, so code stays copyable) with a table of contents sidebar, text size control, a copy button on every code block, "mark as read" progress, and it remembers where you left off in each chapter.

Five books are included:

- **Data Structures & Algorithms** (20 chapters, Python): the patterns coding interviews are built from, each with a template, worked problems with dry runs, common mistakes, and a practice list.
- **System Design** (20 chapters): a framework for the 45-minute design round, the building blocks (load balancing, databases, sharding, caching, queues, consistency, reliability), and full walkthroughs of the classic case studies.
- **Python** (23 chapters): the language from the first line of code to generators, decorators, concurrency, and internals, written for beginners upward. Every chapter ends with the interview questions asked about that topic, with answers; the last chapters are a 100-question bank and 50 "what does this print?" puzzles. The REPL examples are verified with doctest.
- **Databases & SQL** (12 chapters): interview essentials only. One small sample schema, every query executed with its real result shown, the classic problems (nth salary, top per group, duplicates, running totals, medians), and short answers on indexes, transactions, isolation, normalization, and SQL versus NoSQL.
- **Quantitative Aptitude** (20 chapters): maths for UPSC CSAT, BPSC, and SSC. Only the tested topics, each with a formula box, fastest methods and hints, SVG diagrams where they help (alligation cross, geometry theorems, solids, heights and distances, charts, clocks, Venn diagrams), worked examples, a practice set with answers, a one-page formula sheet, and a six-week plan. Every numeric answer is recomputed by a check script.

Books are folders under `interview/`. A folder needs a `book.md` descriptor and chapters named `NN-slug.md` (the number orders them, the slug is the URL):

```
interview/
  dsa-python/
    book.md
    01-how-to-use-this-book.md
    02-arrays-and-two-pointers.md
  system-design/
    book.md
    01-how-to-run-the-interview.md
  python/
    book.md
    01-getting-started.md
  databases-sql/
    book.md
    schema.sql            sample data every query runs against (not a chapter)
    01-how-to-prepare-and-sample-data.md
  quant-aptitude/
    book.md
    01-how-to-prepare.md
```

Both kinds of file start with a small front matter block:

```markdown
---                              ---
title: System Design             title: Arrays & Two Pointers
subtitle: For the design round   part: Core Patterns
description: One paragraph.      summary: One line for the chapter list.
order: 2                         ---
---
```

Add or edit a file and reload; nothing else is needed. Chapters may include inline HTML and SVG (used for diagrams and formula boxes). Reading progress is stored in the browser.

## Project layout

```
books/                      your PDFs
scripts/copy-pdf-worker.mjs copies PDF.js worker + fonts into public/pdfjs (runs before dev/build)
scripts/make-sample-pdf.mjs generates a test PDF: node scripts/make-sample-pdf.mjs 64
interview/                  interview-prep books, one folder each (Markdown chapters)
quizzes/                    quiz sets (JSON)
src/app                     routes: / (library), /read/[id] (reader), /quiz, /interview, /api/books (list, upload, stream, delete)
src/components/BookReader   flipbook, toolbar, navigation, panels
src/components/Library      library grid and cards
src/components/Upload       drag-and-drop uploader
src/components/Interview    book shelf, chapter list, chapter reader, Markdown renderer
src/lib/interview           book and chapter loader (interview/ folder) and reading-progress storage
src/lib/library             LibraryProvider interface + local folder implementation
src/lib/pdf                 PDF.js wrapper and the page bitmap cache
src/lib/storage             ReaderStateStore interface + localStorage implementation
```

## Deploying to Vercel

The repository includes a GitHub Actions workflow, `.github/workflows/deploy.yml`, that lints, typechecks, and deploys with the Vercel CLI: pushes to `master` go to production, pull requests get a preview deployment with the URL posted as a comment.

One-time setup:

1. Create the project on Vercel once, from your machine, so Vercel knows the framework and settings:

   ```bash
   npm i -g vercel
   vercel login
   vercel link          # creates .vercel/project.json (gitignored)
   ```

2. Read the two ids from `.vercel/project.json` (`orgId` and `projectId`) and create a token at Vercel → Account Settings → Tokens.
3. In the GitHub repository go to Settings → Secrets and variables → Actions and add three repository secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
4. Push to `master`. The Actions tab shows the run and the production URL.

If you prefer not to use Actions, importing the repository in the Vercel dashboard deploys on every push with no workflow at all; the workflow only adds the lint and typecheck gate and PR comments.

What works on Vercel: the Interview Prep books and the Quiz section (their files are bundled into the server functions via `outputFileTracingIncludes` in `next.config.ts`). What does not: the PDF library. It reads and writes the local `books/` folder, which is gitignored and, on Vercel, read-only and ephemeral, so the library is empty there and uploads fail. To ship PDFs, either commit them into `books/` (they are then served read-only) or move the library to object storage such as Vercel Blob by implementing the `LibraryProvider` interface.

## Swapping the backend later

The UI only talks to two small interfaces: `LibraryProvider` (list, upload, remove, file URL) and `ReaderStateStore` (position, bookmarks, settings). Implement them on top of Firebase or any other service and pass them in; the reader and library do not change.

DOCX support is intentionally not wired up. When needed, add a converter (LibreOffice headless or a hosted API) behind the upload route and store the resulting PDF in `books/`.

## Notes on rendering quality

Pages are rendered by PDF.js at a minimum of 2x the on-screen size (more on high-DPI screens and when zoomed) and encoded as lossless PNG, so text stays crisp. Scanned or image-based PDFs are limited by their own resolution. Only the pages around the current spread are kept in memory; distant pages are released automatically.
