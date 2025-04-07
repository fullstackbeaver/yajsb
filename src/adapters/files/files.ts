/* file handler specifi for bun */

import { join }    from 'path';
import { readdir } from "node:fs/promises";

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