export interface StoryChapterLink {
  slug: string;
  /** Short name without the "अध्याय N —" prefix. */
  name: string;
  order: number;
}

/** A story on the shelf: one folder under `stories/` holding chapter Markdown files. */
export interface StoryMeta {
  /** Folder name, used in URLs. */
  slug: string;
  title: string;
  genre: string;
  description: string;
  /** Shelf position, from `order:` in story.md; ties broken by title. */
  order: number;
  chapterCount: number;
  /** Total estimated reading time in minutes. */
  minutes: number;
}

/** Everything the chapter list needs; the body is left out. */
export interface StoryChapterMeta {
  story: string;
  /** File name without `.md`, used in URLs. */
  slug: string;
  /** Position in the story, taken from the number in the file name. */
  order: number;
  /** Full heading as written in the file, e.g. "अध्याय 1 — शून्य". */
  title: string;
  /** Heading without the chapter-number prefix, e.g. "शून्य". */
  name: string;
  /** Rough reading time in minutes. */
  minutes: number;
}

export interface StoryChapter extends StoryChapterMeta {
  /** Markdown source with the title heading removed. */
  body: string;
  prev: StoryChapterLink | null;
  next: StoryChapterLink | null;
}
