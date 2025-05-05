export type PageData = {
  [component:string]:DataEntries | Record<string,DataEntries>
}

export type DataEntries = {
  [key:string]:DataEntry
}
type DataEntry = number | string | undefined

export type PartitalPageUpdateArgs = {
  component  : string,
  data       : Record<string, DataEntry>,
  editorData : string,
  url        : string
}