/**
 * Story folders may have spaces or Devanagari names, so route params arrive
 * percent-encoded. Decode them, but tolerate a value that is already plain text.
 */
export function decodeParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
