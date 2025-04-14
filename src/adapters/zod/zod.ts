import { z } from "zod";

  /**
   * Get default data for a given schema.
   *
   * @param schema the schema to generate default data for
   *
   * @returns default value defined in the schema
   */
export function getDefaultData(schema: any) {//TODO changer le type
  const shape = schema._def.shape();
  const objectKeys = Object.keys(shape).filter((key) => {
    const field = shape[key];
    const unwrapped = field.unwrap?.() ?? field; // pour ignorer les optional()
    return unwrapped instanceof z.ZodObject;
  });

  return objectKeys.length === 0
    ? schema.parse({})
    : schema.parse(Object.fromEntries(new Map(objectKeys.map((key) => [key, {}]))));

}

// export function getSchemaKeys(schema: any) {
//   console.log("schema", Object.keys(schema.shape));
//   return Object.keys(schema.shape);
// }