import type { PageData } from "@site";

export const schema   = null
export const isSingle = true;

export function template({pageSettings}:PageData){
  return`
<html lang="${pageSettings.lang}-${pageSettings.lang.toUpperCase()}">
`;
}