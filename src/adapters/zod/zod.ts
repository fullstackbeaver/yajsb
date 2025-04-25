import { z, ZodDefault, ZodEnum, ZodObject, ZodOptional, type ZodTypeAny } from "zod";

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

export function getSchemaKeys(schema: any) {
  const shape = schema._def.shape();
  const objectKeys = Object.keys(shape).filter((key) => {
    const field     = shape[key];
    const unwrapped = field.unwrap?.() ?? field;
    return unwrapped instanceof z.ZodObject;
  });

  return objectKeys.length === 0
    ? extractSchemaDefinition(schema)
    : Object.fromEntries(new Map(objectKeys.map((key) => [key, extractSchemaDefinition(shape[key])])));
}

function extractSchemaDefinition(schema: ZodObject<any>): Record<string, string> {
  const shape = schema.shape;
  const result: Record<string, string> = {};

  for (const key in shape) {
    const field = shape[key];
    const isOptional = field instanceof ZodOptional;
    // Pour accéder au type "nu" on vérifie si c'est optional ou default
    // const baseType = (field instanceof ZodOptional || field instanceof ZodDefault)
    //   ? field._def.innerType
    //   : field;

    const wrapper = extractFromDescription(field._def.description, false);
    const typeName = getZodTypeName(field);

    let finalType: string;
    if (wrapper) {
      finalType = isOptional && !wrapper.endsWith('?') ? wrapper + '?' : wrapper;
    } else {
      finalType = isOptional ? typeName : typeName.replace(/\?$/, "");
    }

    result[key] = finalType;
  }

  return result;
}


function getZodTypeName(zodType: ZodTypeAny): string {

  if (zodType instanceof ZodOptional) {
    return getZodTypeName(zodType._def.innerType) + "?";
  }
  if (zodType instanceof ZodDefault) {
    return getZodTypeName(zodType._def.innerType);
  }
  const typeName = zodType._def.typeName;
  switch (typeName) {
    case "ZodString" : return "string";
    case "ZodNumber" : return "number";
    case "ZodBoolean": return "boolean";
    case "ZodDate"   : return "Date";
    case "ZodEnum"   : return "enum";
      // TODO: ajouter plus de types si necessaire comme ZodLiteral, ZodArray, ZodObject, etc.
    default: return "unknown";
  }
}

function extractFromDescription(description: string | undefined, wantMessage :boolean) {
  if (!description) return ;
  const {message, wrapper} = description.startsWith("{")
    ? JSON.parse(description)
    : {message : description, wrapper : null};
  if (wantMessage) return message;
  return wrapper;
}


/**
 * Extrait les valeurs possibles des champs enum dans un schéma ZodObject
 * @param schema Le schéma Zod
 * @returns Un objet avec les noms des champs et leurs valeurs possibles (tableaux)
 */
export function getEnumValues(schema: ZodObject<any>) {
  const result: Record<string, string[]> = {};
  const shape = schema.shape;

  for (const key in shape) {
    let field = shape[key];

    // Unwrap les ZodOptional et ZodDefault pour atteindre l'enum
    while (field instanceof ZodOptional || field instanceof ZodDefault) {
      field = field._def.innerType;
    }

    if (field instanceof ZodEnum) {
      result[key] = field._def.values;
    }
  }

  return result;
}