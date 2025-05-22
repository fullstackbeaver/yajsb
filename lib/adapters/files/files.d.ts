export type TemplateFolder = {
    data: string[];
    templates: string[];
    styles: string[];
    folders?: {
        [key: string]: TemplateFolder;
    };
};
/**
 * Reads the content of the given folder and returns it as a string array.
 * @param {string | string[]} path The path of the folder to read
 *
 * @returns {Promise<string[]>} A promise that resolves with the content of the folder as a string array
 */
export declare function getFolderContent(path: string | string[]): Promise<string[]>;
/**
 * Writes the given data to a file at the given path.
 * @param {string} path The path of the file to write
 * @param {string} data The data to write in the file
 *
 * @returns {Promise<void>} A promise that resolves when the file has been written
 */
export declare function writeToFile(path: string, data: string): Promise<number>;
/**
 * Reads a JSON file at the given path and returns its content parsed as an object.
 * @param {string} path The path of the JSON file to read
 *
 * @returns {Promise<object>} A promise that resolves with the parsed content of the JSON file
 */
export declare function readJsonFile(path: string): Promise<any>;
/**
 * Takes a path and generates a nested object of folders and their content.
 * The function is recursive and will traverse all subfolders.
 * The object will have the following structure:
 * {
 *   [key: string]: {
 *     data     : string[]
 *     templates: string[]
 *     styles   : string[]
 *     folders ?: {
 *       [key: string]: TemplateFolder
 *     }
 *   }
 * }
 * @param {string | string[]} path         The path to generate the content from.
 * @param {string}            [folderName] The name of the folder to generate the content for. If not provided, the function will use the last segment of the path as the folder name.
 * @returns {Promise<{ [key: string]: TemplateFolder }>} An object with the folder name as key and the content as value.
 */
export declare function getFolderContentRecursive(path: string | string[], folderName?: string): Promise<{
    [key: string]: TemplateFolder;
}>;
/**
 * Write a JSON file at the given path. The data is stringified with an indentation of 2 spaces.
 * @param {string} path The path where to write the JSON file
 * @param {object} data The data to write in the JSON file
 */
export declare function writeJson(path: string, data: any): void;
/**
 * Reads a file at the given path and returns its content as a string.
 * @param {string} path The path of the file to read
 *
 * @returns {Promise<string>} A promise that resolves with the content of the file as a string
 */
export declare function readFileAsString(path: string): Promise<string>;
/**
 * Creates a new directory at the given path.
 * If the directory already exists, this function does nothing.
 * @param {string} path The path of the directory to create
 */
export declare function createDirectory(path: string): Promise<void>;
