/* file handler specifi for bun */

import { join }    from 'path';
import { readdir } from "node:fs/promises";
import { dataExtension, templateExtension } from '@core/constants';

export type TemplateFolder = {
  data      : string[]
  templates : string[]
  folders  ?: {
    [key: string]: TemplateFolder
  };
};

export function getFolderContent(path: string | string[]) :Promise<string[]> {
  if (Array.isArray(path)) path = join(...path);
  return readdir(path);
}

export function writeToFile(path: string, data: string) {
  return Bun.write(path, data);
}

export function readJsonFile(path: string) {
  return Bun.file(path).json();
}

export async function getFolderContentRecursive( path: string | string[], folderName?: string ): Promise<{ [key: string]: TemplateFolder }> {
  if (Array.isArray(path)) path = join(...path);
  const files = await readdir(path, { withFileTypes: true });

  const current: TemplateFolder = {
    data     : [],
    templates: []
  };

  for (const file of files) {
    if (file.isDirectory()) {
      const subfolder = await getFolderContentRecursive(join(path, file.name), file.name);
      if (!current.folders) current.folders = {};
      current.folders[file.name] = subfolder[file.name];
    } else if (file.name.endsWith(templateExtension)) {
      current.templates.push(file.name.slice(0, -templateExtension.length));
    } else if (file.name.endsWith(dataExtension)) {
      current.data.push(file.name.slice(0, -dataExtension.length));
    }
  }

  const name = folderName ?? path.split(/[\\/]/).pop()!; // si pas de nom, on extrait le dernier segment du chemin
  return {
    [name]: current,
  };

}