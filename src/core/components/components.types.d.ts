import type { ZodSchema } from "zod";

export type WrapperEditor = Partial<{ [editorSpecial in EditorPossibility]: string[] }>

type EditorPossibility = "html" | "imagePicker"
export type ComponentData     = {
  description   : string
  schema        : ZodSchema | null
  template      : Function
  wrapperEditor?: WrapperEditor
};

export type Components = {
  [key in string]: ComponentData
};