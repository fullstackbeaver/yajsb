/**
 * Deeply merges two objects, returning a new object that combines the properties
 * of both. If a property is an object in both `obj1` and `obj2`, the merge is
 * applied recursively. Primitive values in `obj2` will overwrite those in `obj1`.
 *
 * @template T - The type of the first object.
 * @template U - The type of the second object.
 * @param {T} obj1 - The first object to merge.
 * @param {U} obj2 - The second object to merge.
 *
 * @returns {T & U} - A new object containing merged properties of `obj1` and `obj2`.
 */

export function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  const result = { ...obj1 } as T & U;

  for (const key of Object.keys(obj2) as Array<keyof U>) {
    const value = obj2[key];

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const existing = (result as any)[key];
      (result as any)[key] = merge(
        typeof existing === "object" && existing !== null ? existing : {},
        value
      );
    } else {
      (result as any)[key] = value;
    }
  }

  return result;
}