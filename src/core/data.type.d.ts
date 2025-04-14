export type PageData = {
  [component in Component]:DataEntries | Record<string,DataEntries>
}

export type DataEntries = {
  [key:string]:DataEntry
}
type DataEntry = number | string | undefined

export type EditorData = {
  description?: string,
  wrapperEditor?: WrapperEditor
}