export type Data = {
  [component:string]:{
    [id:string]:DataEntries
  }
}
export type DataEntries = {
  [key:string]:DataEntry
}
type DataEntry = number | string | undefined

export type PageData = Data & { global: Global }