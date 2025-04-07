import type { TemplateFolder} from "@adapters/files/files";

import { basePage, index }           from "./constants";
import { getFolderContentRecursive } from "@adapters/files/files";

/**
 * Gets the site tree (all existing page locations) from the filesystem.
 *
 * @param {boolean} [withAddLocation] If true, will add a location path with a '+' at the end,
 *                                    indicating that user can create a page here.
 *
 * @returns An array of paths that are existing page locations.
 */
export async function getFileTree(withAddLocation = false): Promise<string[]> {
  return getGeneratedPaths(await getFolderContentRecursive(basePage), withAddLocation)
    .map(path => path.slice("/pages".length));
}

/**
 * Takes a nested object of folders and generates an array of paths.
 *
 * @param {string[]} folders       The object of folders to generate paths from.
 * @param {boolean}  [addLocation] If true, will add a location path with a '+' at the end,
 *                                 indicating that user can create a page here.
 * @param {string}   [currentPath] The current path to start generating paths from.
 *
 * @returns An array of generated paths.
 */
function getGeneratedPaths( folders: { [key: string]: TemplateFolder }, addLocation=false, currentPath = '' ): string[] {
  const paths: string[] = [];

  for (const folderName in folders) {
    const folder  = folders[folderName];
    const newPath = `${currentPath}/${folderName}`.replace(/\/+/g, '/');

    const hasIndexData      = folder.data.includes(index);
    const hasIndexTemplate  = folder.templates.some(t => t.endsWith(index));
    const hasChildsTemplate = folder.templates.some(t => t.endsWith("childs"));

    if (hasIndexData && hasIndexTemplate) paths.push(newPath);

    if (hasChildsTemplate) {
      addLocation &&paths.push(`${newPath}/+`);
      for (const dataItem of folder.data) {
        dataItem !== index && paths.push(`${newPath}/${dataItem}`);
      }
    }

    if (folder.folders) {
      const subPaths = getGeneratedPaths(folder.folders, addLocation, newPath);
      paths.push(...subPaths);
    }
  }

  return paths;
}