import      { index, pageFolder, projectRoot } from "./constants";
import type { TemplateFolder }                 from "@adapters/files/files";
import      { getFolderContentRecursive }      from "@adapters/files/files";


/**
 * Returns a filtered array of paths based on the given options.
 *
 * @param {boolean}  includeAddLocation If true, will include paths where we could add a new page
 * @param {boolean}  includeUnpublished If true, will include paths that are not yet published
 * @param {string[]} [refs]             The array of paths to filter usefull for testing purposes
 *
 * @returns {string[]} The filtered array of paths
 */
export async function getFileTree(includeAddLocation: boolean, includeUnpublished: boolean, refs?: string[]): Promise<string[]> {
  refs ??= await getGeneratedPaths(await getFolderContentRecursive(projectRoot+pageFolder), true);

  return refs.filter((path) => {
    const lastElement = path.split("/").pop();

    if (!includeAddLocation && path.endsWith("+"))           return false;
    if (!includeUnpublished && lastElement?.startsWith("_")) return false;
    return true;
  });
}

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
export function getGeneratedPaths( folders: { [key: string]: TemplateFolder }, addLocation = false, currentPath = ''): string[] {
  const paths: string[] = [];

  for (const folderName in folders) {
    const folder  = folders[folderName];
    const newPath = `${currentPath}/${folderName}`.replace(/\/+/g, '/');

    const hasIndexData      = folder.data.includes(index)      || folder.data.some(d => d.endsWith('.index'));
    const hasIndexTemplate  = folder.templates.includes(index) || folder.templates.some(t => t.endsWith('.index'));
    const hasChildsTemplate = folder.templates.some(t => t.endsWith('childs'));

    if (hasIndexData && hasIndexTemplate) {
      paths.push(newPath);
    }

    if (hasChildsTemplate) {
      if (addLocation) {
        paths.push(`${newPath}/+`);
      }

      for (const dataItem of folder.data) {
        if (!dataItem.endsWith("."+index) && dataItem !== index) {
          paths.push(`${newPath}/${dataItem}`);
        }
      }
    }

    if (folder.folders) {
      const subPaths = getGeneratedPaths(folder.folders, addLocation, newPath);
      paths.push(...subPaths);
    }
  }

  return paths.map(path =>  path === pageFolder ? "/" :  path.replace(pageFolder, ''));
}