import { z }   from 'zod';

import type { Data, DataEntries, PageData } from "./data.type";

import { global, sharedIndex } from '@core/constants';

let pageData   = {} as PageData;
let sharedData = {} as Data;


export function getComponentData(componentName: string, id: string, schema: any): DataEntries {
  if (id.startsWith(sharedIndex)) {
    if (!sharedData[componentName][id]) throw new Error(`Shared data not found for component ${componentName} with id ${id}`);
    return sharedData[componentName][id];
  }

  if (pageData[componentName]?.[id]) return pageData[componentName][id];

  //default values extacted from schema
  if (schema === undefined) throw new Error(`Schema not found for component ${componentName}, and no data found in pageData`);
  if (schema === null)      return {};

  const result: DataEntries = schema.parse({});
  const shape = (schema._def as any).shape();
  Object.entries( shape )
    .filter(([_, fieldSchema]) => (fieldSchema as any)._def.typeName === z.ZodFirstPartyTypeKind.ZodOptional)
    .forEach(([key]) => result[key] = undefined);
  return result;
}

export function getGlobalData() {
  return pageData[global];
}

export function setPageData( data: PageData) {
  pageData = data;
}

export function setSharedData( data: PageData) {
  sharedData = data;
}

export function hasSharedData() {
  return Object.keys(sharedData).length > 0
}

/**
 * This function takes a `Data` object and transform it into a `Data` with all the
 * values of the object having the attribute `data-editor` added.
 *
 * @returns {Record<string, string>} - The listeners
 */
export function completePageData() {
  const listeners = {} as Record<string, string>;

  for (const [mainKey, objValues] of Object.entries(pageData)) {
    if (mainKey === global) continue;

    for (const [id, values] of Object.entries(objValues)) {
      const componentRef = `${mainKey}-${id}`;
      for (const [key, value] of Object.entries(values)) {
        const refKey               = `${componentRef}-${key}`;
        pageData[mainKey][id][key] = value + `" data-editor="${refKey}`;
        listeners[refKey]          = mainKey;
      }
    }
  }

  return listeners;
}

// function generateUniqueId(): string {
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
//       const r = (Math.random() * 16) | 0;
//       const v = c === 'x' ? r : (r & 0x3) | 0x8;
//       return v.toString(16);
//   });
// }sharedData