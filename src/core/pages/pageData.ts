import type { DataEntries, DataEntry, PageData }                   from "./pages.types";
import      { dataExtension, projectRoot, sharedIndex, sharedKey } from "@core/constants";
import      { extractFromUrl }                                     from "./url";
import      { readJsonFile }                                       from "@adapters/files/files";
import      { sanitizeInput }                                      from "ls4bun";

export async function loadSharedData() { //TODO cette fonction ne devrait plus exister
  return await readJsonFile(projectRoot+"/"+sharedKey+dataExtension) as PageData;
}

export async function loadPagesData(path:string) {
  return await readJsonFile(path) as PageData;
}


export async function formatDataToSave(dataToLoad:string, data:DataEntries, component:string, editorData:string){

  const [_, editor, id] = editorData.split(".") as [string, string | undefined, string | undefined];
  const isSharedData    = editor && editor.startsWith(sharedIndex) ? true : false;
  const target          = isSharedData
    ? projectRoot+"/"+sharedKey+dataExtension
    : dataToLoad;

  return {
    target,
    dataToSave:  merge(await readJsonFile(target), reformatComponentData(component, id, editor, data)),
    isSharedData
  }
}

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

  function reformatComponentData(component:string, id:string | undefined, editor:string| undefined, data:Record<string, DataEntry>) {
    if (editor === undefined && id === undefined)
      return { [component]: sanitizeInput(data) };

    return id === undefined
      ? { [component]: { [editor as string]: sanitizeInput(data) } }
      : { [component]: { [id]: { [editor as string]: sanitizeInput(data) } } };
  }