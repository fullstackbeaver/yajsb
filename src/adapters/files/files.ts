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

export function getFolderContent(path: string | string[]) :Promise<string[]> {
  if (Array.isArray(path)) path = join(...path);
  return readdir(path);
}

export function writeToFile(path: string, data: string) {
  return Bun.write( path, data );
}

export function readJsonFile(path: string) {
  return Bun.file(path).json();
}

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

export function writeJson(path: string, data: any) {
  writeToFile(path, JSON.stringify(data, null, 2));
}

export async function readFileAsString(path: string) {
  return await Bun.file(path).text();
}


export async function createDirectory(path: string) {
  await mkdir(path, { recursive: false });
}

