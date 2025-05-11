import type { DataEntries, DataEntry, PageData }                   from "./pages.types";
import      { dataExtension, projectRoot, sharedIndex, sharedKey } from "@core/constants";
import      { readJsonFile }                                       from "@adapters/files/files";
import      { sanitizeInput }                                      from "ls4bun";

/**
 * Loads the shared data for the entire site.
 *
 * This function reads the JSON file at `projectRoot/shared.json` and
 * returns the parsed data as a `PageData` object.
 *
 * @returns {Promise<PageData>} A promise resolving to the shared data as a `PageData` object.
 */
export async function loadSharedData() { //TODO cette fonction ne devrait plus exister
  return await readJsonFile(projectRoot+"/"+sharedKey+dataExtension) as PageData;
}

/**
 * Loads the page data from the given path.
 *
 * This function reads the JSON file at the given path and returns the parsed
 * data as a `PageData` object.
 *
 * @param {string} path - The path of the JSON file to load. This should be the
 * path to a file in the `pages/` directory, relative to the project root.
 *
 * @returns {Promise<PageData>} A promise resolving to the page data as a `PageData` object.
 */
export async function loadPagesData(path:string) {
  return await readJsonFile(path) as PageData;
}

/**
 * Formats the data to be saved by determining the target location and merging
 * the existing data with the new component data.
 *
 * This function takes the path of the data to load, the new data entries, the
 * component name, and the editor data string. It determines whether the data
 * is shared based on the editor prefix and constructs the target path
 * accordingly. It then merges the current data at the target location with
 * the new component data.
 *
 * @param {string}      dataToLoad - The path of the data to load, typically a file path.
 * @param {DataEntries} data       - The new data entries to be saved.
 * @param {string}      component  - The name of the component associated with the data.
 * @param {string}      editorData - A string representing the editor context, which helps determine if the data is shared.
 *
 * @returns {Promise<{ target: string; dataToSave: PageData; isSharedData: boolean; }>}
 *   A promise resolving to an object containing the target path, the merged
 *   data to be saved, and a boolean indicating if the data is shared.
 */
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

/**
 * Reformats the component data to be saved, taking into account the component name,
 * optional id, editor context, and the input data.
 *
 * This function returns an object with the component name as the first key. If the
 * editor context is not provided, it stores the sanitized input data directly under the
 * component name. If the editor context is provided, it stores the sanitized input data
 * under the component name as a nested object with the editor context as the first key.
 * If an id is provided, it stores the sanitized input data under the component name as a
 * nested object with the id as the first key, and the editor context as the second key.
 *
 * @param {string}                    component - The name of the component associated with the data.
 * @param {string | undefined}        id        - The unique identifier for the component data, if any.
 * @param {string | undefined}        editor    - The string representing the editor context, if any.
 * @param {Record<string, DataEntry>} data      - The input data to be sanitized and reformatted.
 *
 * @returns {Record<string, unknown>} The reformatted data object.
 */
function reformatComponentData(component:string, id:string | undefined, editor:string| undefined, data:Record<string, DataEntry>) {
  if (editor === undefined && id === undefined)
    return { [component]: sanitizeInput(data) };

  return id === undefined
    ? { [component]: { [editor as string]: sanitizeInput(data) } }
    : { [component]: { [id]: { [editor as string]: sanitizeInput(data) } } };
}