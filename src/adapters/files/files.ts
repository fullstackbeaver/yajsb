/* file handler specific for bun */

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
    const fileName = file.name;

    if (file.isDirectory()) {
      const subfolder = await getFolderContentRecursive(join(path, fileName), fileName);
      (current.folders ??= {})[fileName] = subfolder[fileName];
      continue;
    }

    if (fileName.endsWith(templateExtension)) {
      current.templates.push(fileName.slice(0, -templateExtension.length));
      continue;
    }

    if (fileName.endsWith(dataExtension)) {
      current.data.push(fileName.slice(0, -dataExtension.length));
    }
  }

  const name = folderName ?? path.split(/[\\/]/).pop()!; // si pas de nom, on extrait le dernier segment du chemin
  return {
    [name]: current,
  };

}