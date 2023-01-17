export { slugify } from "~/notion/helpers";

export function typedBoolean<T>(
  value: T,
): value is Exclude<T, "" | 0 | false | null | undefined> {
  return Boolean(value);
}

export function groupBy<T>(
  list: T[],
  selector: (t: T) => string,
): Record<string, T[] | undefined> {
  return list.reduce<Record<string, T[]>>((acc, curr) => {
    const key = selector(curr);
    if (!(key in acc)) {
      acc[key] = [];
    }
    acc[key].push(curr);
    return acc;
  }, {});
}

type ClassName =
  | undefined
  | string
  | number
  | Record<string, boolean>
  | ClassName[];

/**
 * Simple utility function for creating conditional class names with a bit more
 * help than template strings gives you.
 *
 * Basically this: https://www.npmjs.com/package/classnames
 *
 * @param args {ClassName[]} - class names to combine.
 */
export function classNames(...args: ClassName[]): string {
  const resolved: (string | number)[] = [];
  for (const arg of args) {
    if (typeof arg === "number" || typeof arg === "string") {
      resolved.push(arg);
    } else if (Array.isArray(arg)) {
      resolved.push(classNames(...arg));
    } else if (typeof arg === "object") {
      resolved.push(...Object.keys(arg).filter((it) => arg[it]));
    }
  }
  return resolved.filter(typedBoolean).join(" ");
}
