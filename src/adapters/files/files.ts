/* file handler specific for bun */

import { dataExtension, templateExtension } from '@core/constants';
import { mkdir, readdir }                   from "node:fs/promises";
import { join }                             from 'path';


export type TemplateFolder = {
  data      : string[]
  templates : string[],
  styles    : string[],
  folders  ?: {
    [key: string]: TemplateFolder
  };
};

/**
 * Reads the content of the given folder and returns it as a string array.
 * @param {string | string[]} path The path of the folder to read
 *
 * @returns {Promise<string[]>} A promise that resolves with the content of the folder as a string array
 */
export async function getFolderContent(path: string | string[]) :Promise<string[]> {
  if (Array.isArray(path)) path = join(...path);
  return await readdir(path);
}

/**
 * Writes the given data to a file at the given path.
 * @param {string} path The path of the file to write
 * @param {string} data The data to write in the file
 *
 * @returns {Promise<void>} A promise that resolves when the file has been written
 */
export function writeToFile(path: string, data: string) {
  return Bun.write( path, data );
}

/**
 * Reads a JSON file at the given path and returns its content parsed as an object.
 * @param {string} path The path of the JSON file to read
 *
 * @returns {Promise<object>} A promise that resolves with the parsed content of the JSON file
 */
export function readJsonFile(path: string) {
  return Bun.file(path).json();
}

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
export async function getFolderContentRecursive( path: string | string[], folderName?: string ): Promise<{ [key: string]: TemplateFolder }> {
  if (Array.isArray(path)) path = join(...path);
  const files = await readdir(path, { withFileTypes: true });

  const current: TemplateFolder = {
    data     : [],
    templates: [],
    styles   : [],
  };

  for (const file of files) {
    const fileName = file.name;

    if (file.isDirectory()) {
      const subfolder = await getFolderContentRecursive(join(path, fileName), fileName);
      if (current.folders == null) current.folders = {};
      current.folders[fileName] = subfolder[fileName];
      continue;
    }

    if (fileName.endsWith(templateExtension)) {
      current.templates.push(fileName.slice(0, -templateExtension.length));
      continue;
    }

    if (fileName.endsWith(dataExtension)) {
      current.data.push(fileName.slice(0, -dataExtension.length));
    }

    if (fileName.endsWith("scss")) {
      current.styles.push(fileName.slice(0, -dataExtension.length));
    }
  }

  const name = folderName ?? path.split(/[\\/]/).pop()!; // si pas de nom, on extrait le dernier segment du chemin
  return {
    [name]: current,
  };
}

/**
 * Write a JSON file at the given path. The data is stringified with an indentation of 2 spaces.
 * @param {string} path The path where to write the JSON file
 * @param {object} data The data to write in the JSON file
 */
export function writeJson(path: string, data: any) {
  writeToFile(path, JSON.stringify(data, null, 2));
}

/**
 * Reads a file at the given path and returns its content as a string.
 * @param {string} path The path of the file to read
 *
 * @returns {Promise<string>} A promise that resolves with the content of the file as a string
 */
export async function readFileAsString(path: string) {
  return await Bun.file(path).text();
}

/**
 * Creates a new directory at the given path.
 * If the directory already exists, this function does nothing.
 * @param {string} path The path of the directory to create
 */
export async function createDirectory(path: string) {
  await mkdir(path, { recursive: false });
}