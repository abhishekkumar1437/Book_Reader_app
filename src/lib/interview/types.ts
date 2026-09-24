/** One `##` or `###` heading inside a chapter, used for the table of contents. */
export interface ChapterHeading {
  depth: 2 | 3;
  text: string;
  id: string;
}

export interface ChapterLink {
  slug: string;
  title: string;
}

/** A book in the interview-prep shelf: one folder of Markdown chapters plus a `book.md` descriptor. */
export interface BookMeta {
  /** Folder name, used in URLs. */
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  /** Shelf position, from `order:` in book.md; ties broken by title. */
  order: number;
  chapterCount: number;
  /** Total estimated reading time in minutes. */
  minutes: number;
}

/** Everything the chapter list needs; the body is left out. */
export interface ChapterMeta {
  book: string;
  slug: string;
  /** Position in the book, taken from the numeric file-name prefix. */
  order: number;
  title: string;
  /** Section of the book, e.g. "Core Patterns". Chapters are grouped by this. */
  part: string;
  summary: string;
  /** Rough reading time in minutes. */
  minutes: number;
  headings: ChapterHeading[];
}

export interface Chapter extends ChapterMeta {
  /** Markdown source with the front matter removed. */
  body: string;
  prev: ChapterLink | null;
  next: ChapterLink | null;
}
