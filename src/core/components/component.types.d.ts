type EditorPossibility = "html" | "imagePicker" | "urlPicker" | "videoPicker" // TODO : add code for each possibility

export type ComponentMainData     = {
  description  ?: string
  schema        : ZodSchema | null
  template      : Function
};

export type Components = Record<string, ComponentMainData>

export type ComponentItemData = Record<string, number|string>

export type ComponentRenderData = {
  component   : string
  data        : ComponentItemData
  editorMode  : boolean
  id          : string | undefined
  pageSettings: ComponentItemData
  template    : Function
}

export type DescribeCpnArgs = {
  message ?: string
  wrapper ?: EditorPossibility
}

export type ExportedComponent = {
  isSingle: boolean
  schema  : ZodSchema | null
  template: Function  | null
}