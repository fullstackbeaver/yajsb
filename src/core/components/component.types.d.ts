import type { ZodSchema } from "zod";

export type WrapperEditor = Partial<{ [editorSpecial in EditorPossibility]: string[] }>

type EditorPossibility = "html" | "imagePicker" | "json" | "link" | "text" | "video" // TODO : add code for each possibility

export type ComponentMainData     = {
  description   : string
  schema        : ZodSchema | null
  template      : Function
  wrapperEditor?: WrapperEditor
};

export type Components = Record<string, ComponentWithChild | ComponentWithoutChild>

export type ComponentWithChild = ComponentMainData & {
  items : Record<string, ComponentItemData>
}

export type ComponentWithoutChild = ComponentMainData & {
  data : ComponentItemData
}

export type ComponentItemData = Record<string, number|string>

export type ComponentRenderData = {
  component   : string
  data        : ComponentItemData
  editorMode  : boolean
  id          : string | undefined
  pageSettings: ComponentItemData
  template    : Function
}