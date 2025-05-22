import type { TemplateFolder } from "../adapters/files/files";
/**
 * Returns a filtered array of paths based on the given options.
 *
 * @param {boolean}  includeAddLocation If true, will include paths where we could add a new page
 * @param {boolean}  includeUnpublished If true, will include paths that are not yet published
 * @param {string[]} [refs]             The array of paths to filter usefull for testing purposes
 *
 * @returns {string[]} The filtered array of paths
 */
export declare function getFileTree(includeAddLocation: boolean, includeUnpublished: boolean, refs?: string[]): Promise<string[]>;
/**
 * Takes a nested object of folders and generates an array of paths.
 * @internal exported only for testing purpose
 *
 * @param {string[]} folders       The object of folders to generate paths from.
 * @param {boolean}  [addLocation] If true, will add a location path with a '+' at the end,
 *                                 indicating that user can create a page here.
 * @param {string}   [currentPath] The current path to start generating paths from.
 *
 * @returns {string[]} An array of generated paths.
 */
export declare function getGeneratedPaths(folders: {
    [key: string]: TemplateFolder;
}, addLocation?: boolean, currentPath?: string): string[];
