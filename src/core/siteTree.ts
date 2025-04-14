import type { TemplateFolder} from "@adapters/files/files";

import { index, pageFolder, projectRoot } from "./constants";
import { getFolderContentRecursive }      from "@adapters/files/files";

let fileTree: string[] = [];

/**
 * Updates the global file tree by recursively fetching folder content from the base page
 * and generates an array of paths. It resets the existing file tree before updating.
 *
 * @returns {Promise<void>} A promise that Updates the global file tree when resolved.
 */
export async function updateFileTree(): Promise<void> {
  fileTree.length = 0;
  fileTree = getGeneratedPaths(await getFolderContentRecursive(projectRoot+pageFolder), true)
    .map(path => path.slice(pageFolder.length));

  if (fileTree[0] === "") fileTree[0] = "/";
}

/**
 * Returns a filtered array of paths based on the given options.
 *
 * @param {boolean}  includeAddLocation If true, will include paths where we could add a new page
 * @param {boolean}  includeUnpublished If true, will include paths that are not yet published
 * @param {string[]} [refs]             The array of paths to filter
 *
 * @returns {string[]} The filtered array of paths
 */
export function getFileTree(includeAddLocation: boolean, includeUnpublished: boolean, refs=fileTree): string[] {
  return refs.filter((path) => {
    const lastElement = path.split("/").pop();

    if (!includeAddLocation && path.endsWith("+"))           return false;
    if (!includeUnpublished && lastElement?.startsWith("_")) return false;
    return true;
  });
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