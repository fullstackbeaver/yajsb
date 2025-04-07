import type { ComponentData, Components } from "./components.types";

import { getFolderContent } from "src/adapters/files/files";
import { tsExtension }      from "@core/constants";

const components = {} as Components;

export function getComponent(componentName:string){
  if (!components[componentName]) {
    throw new Error(`Component ${componentName} not found`);
  }
  return components[componentName];
}

export async function findComponents(src: string[]) {

  if (Object.keys(components).length > 0) return;

  for (const endPath of src) {
    const path          = process.cwd() + endPath;
    const files         = await getFolderContent(path);
    const filteredFiles = files.filter(file => !file.endsWith(tsExtension));
    for (const file of filteredFiles) {
      const { description, schema, template, wrapperEditor } = await import(`${path}/${file}/${file}${tsExtension}`) as ComponentData;
      components[file] = { description, schema, template, wrapperEditor };
    }
  }
}