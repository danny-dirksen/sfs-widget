/**
 * Finds duplicate strings in an array.
 * @param arr The array of strings to check for duplicates.
 * @returns An array of duplicate strings.
 */
export function findDuplicates(arr: string[]): string[] {
  return Object.entries(countStrings(arr))
    .filter(([_, count]) => count > 1)
    .map(([str]) => str);
}
/**
 * Counts the occurrences of each string in an array.
 * @param arr The array of strings to count.
 * @returns An object mapping each string to its count.
 */
function countStrings(arr: string[]): Record<string, number> {
  return arr.reduce<Record<string, number>>((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});
}
