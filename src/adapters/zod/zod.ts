import { z, ZodDefault, ZodEnum, ZodObject, ZodOptional, type ZodTypeAny } from "zod";

/**
 * Get default data for a given schema.
 *
 * @param {ZodObject<any>} schema the schema to generate default data for
 *
 * @returns default value defined in the schema
 */
export function getDefaultData(schema: ZodObject<any>) {
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

/**
 * Returns an object with the keys of the given schema and the definition of the schemas for each key.
 *
 * If the schema is a simple schema (not an object), it will return the definition of the schema.
 *
 * @param {ZodObject<any>} schema - The `ZodObject` schema for which to generate the keys.
 *
 * @returns an object with the keys as key and the definition of the schemas as value
 */
export function getSchemaKeys(schema: ZodObject<any>) {
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

/**
 * Extracts the schema definition from a given ZodObject schema.
 *
 * This function iterates over the shape of the schema, determining the type of each field.
 * If a field is wrapped with a custom description, it uses that as the type,
 * otherwise, it uses the Zod type name. It also handles optionality by appending
 * a '?' to the type if the field is optional.
 *
 * @param {ZodObject<any>} schema - The ZodObject schema to extract the definition from.
 *
 * @returns {Record<string, string>} An object mapping each key in the schema to its type definition.
 */
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


/**
 * Returns the type name of a given ZodTypeAny as a string.
 *
 * For simple types, it returns the type name (e.g. "string", "number", etc.).
 * For optional types, it appends a '?' to the end of the type name.
 * For default types, it returns the type name of the inner type.
 *
 * @param {ZodTypeAny} zodType - The ZodTypeAny to get the type name from.
 *
 * @returns {string} The type name as a string.
 */
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

/**
 * Extracts either the message or the wrapper from a description string.
 *
 * The description string can either be a JSON object or a plain string.
 * If it's a JSON object, it is expected to have "message" and "wrapper" keys.
 * If it's a plain string, it is treated as the message.
 *
 * @param {string | undefined} description - The description to extract from.
 * @param {boolean}            wantMessage - If true, extracts the message; otherwise, extracts the wrapper.
 *
 * @returns {string | null | undefined} - Returns the extracted message or wrapper,
 *                                        or undefined if the description is not provided.
 */
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
 * @param {ZodObject<any>} schema Le schéma Zod
 *
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