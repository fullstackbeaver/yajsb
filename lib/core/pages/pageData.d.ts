import type { DataEntries, PageData } from "./pages.types";
import { getComponentByName } from "../components/component";
/**
 * Loads the shared data for the entire site.
 *
 * This function reads the JSON file at `projectRoot/shared.json` and
 * returns the parsed data as a `PageData` object.
 *
 * @returns {Promise<PageData>} A promise resolving to the shared data as a `PageData` object.
 */
export declare function loadSharedData(): Promise<PageData>;
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
export declare function loadPagesData(path: string): Promise<PageData>;
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
export declare function formatDataToSave(dataToLoad: string, data: DataEntries, component: string, editorData: string, getCpn?: typeof getComponentByName): Promise<{
    dataToSave: any;
    isSharedData: boolean;
    target: string;
}>;
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
export declare function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U;
