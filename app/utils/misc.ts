export { slugify } from "~/notion/helpers";

export function typedBoolean<T>(
  value: T,
): value is Exclude<T, "" | 0 | false | null | undefined> {
  return Boolean(value);
}

export function groupBy<T>(
  list: T[],
  selector: (t: T) => string,
): Record<string, T[]> {
  return list.reduce<Record<string, T[]>>((acc, curr) => {
    const key = selector(curr);
    if (!(key in acc)) {
      acc[key] = [];
    }
    acc[key].push(curr);
    return acc;
  }, {});
}
