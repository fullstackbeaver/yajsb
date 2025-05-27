/* eslint-disable no-unused-vars */
export enum HeaderCustomKeys {
  // KEY      = "x-route-key",
  // LANG     = "x-locale",
  // SLUG     = "x-slug",
  // TYPEPAGE = "x-type-page"
  // ACTION     = "x-a1",
  // PATH       = "x-p1",
  PROJECT    = "x-p2",
}

export const cacheCtr = {
  maxAge              : 5,                  // revalidation après 5 secondes
  staleWhileRevalidate: 60 * 60 * 24 * 7,   // 1 semaine
};