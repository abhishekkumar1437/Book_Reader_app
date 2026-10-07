/** Reading progress for the interview-prep shelf. See `@/lib/reading/storage` for the shape. */
import { createReadingStore } from "@/lib/reading/storage";

export { chapterKey, type ProseSize } from "@/lib/reading/storage";

export const interviewStore = createReadingStore("book-reader:interview:");
