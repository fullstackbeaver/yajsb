import type { PageSettings } from "@core/components/pageSettings/pageSettings.types";

export const schema = null

export function template({pageSettings}:{pageSettings:PageSettings}){
  return`
<html lang="${pageSettings.lang}-${pageSettings.lang.toUpperCase()}">
`;
}