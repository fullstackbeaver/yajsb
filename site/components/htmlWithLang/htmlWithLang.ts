import type { Global } from "@coreComponents/global/global.types";

export const schema = null

export function template({global}:{global:Global}){
  return`
<html lang="${global.lang}-${global.lang.toUpperCase()}">
`;
}