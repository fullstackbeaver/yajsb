import type { TemplateFolder} from "@adapters/files/files";

import { basePage, index }           from "./constants";
import { getFolderContentRecursive } from "@adapters/files/files";

export async function getFileTree() {
  return getGeneratedPaths(await getFolderContentRecursive(basePage))
    .map(path => path.slice("/pages".length));
}

function getGeneratedPaths( folders: { [key: string]: TemplateFolder }, currentPath = '' ): string[] {
  const paths: string[] = [];

  for (const folderName in folders) {
    const folder  = folders[folderName];
    const newPath = `${currentPath}/${folderName}`.replace(/\/+/g, '/');

    const hasIndexData      = folder.data.includes(index);
    const hasIndexTemplate  = folder.templates.some(t => t.endsWith(index));
    const hasChildsTemplate = folder.templates.some(t => t.endsWith("childs"));

    if (hasIndexData && hasIndexTemplate) paths.push(newPath);

    if (hasChildsTemplate) {
      paths.push(`${newPath}/+`);
      for (const dataItem of folder.data) {
        if (dataItem !== index) {
          paths.push(`${newPath}/${dataItem}`);
        }
      }
    }

    if (folder.folders) {
      const subPaths = getGeneratedPaths(folder.folders, newPath);
      paths.push(...subPaths);
    }
  }

  return paths;
}