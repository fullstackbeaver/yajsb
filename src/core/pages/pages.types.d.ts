import type { Component } from "@site";

export type PageData = {
  [component in Component]:DataEntries | Record<string,DataEntries>
}

export type DataEntries = {
  [key:string]:DataEntry
}
type DataEntry = number | string | undefined

export type PartitalPageUpdateArgs = {
  component  : string,
  data       : Record<string, DataEntry>,
  editorData : string,
  id        ?: string,
  url        : string
}