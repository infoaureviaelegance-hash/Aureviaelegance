export function titleize(value: string): string {
  return value
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) =>
      word.length === 0
        ? word
        : `${word.charAt(0).toLocaleUpperCase()}${word.slice(1)}`,
    )
    .join(" ");
}
