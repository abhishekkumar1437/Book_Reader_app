/** Reading progress for the story shelf. See `@/lib/reading/storage` for the shape. */
import { createReadingStore } from "@/lib/reading/storage";

export { chapterKey, type ProseSize } from "@/lib/reading/storage";

export const storyStore = createReadingStore("book-reader:story:");
