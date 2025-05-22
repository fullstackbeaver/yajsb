import { ZodObject } from "zod";
/**
 * Get default data for a given schema.
 *
 * @param {ZodObject<any>} schema the schema to generate default data for
 *
 * @returns default value defined in the schema
 */
export declare function getDefaultData(schema: ZodObject<any>): {
    [x: string]: any;
};
/**
 * Returns an object with the keys of the given schema and the definition of the schemas for each key.
 *
 * If the schema is a simple schema (not an object), it will return the definition of the schema.
 *
 * @param {ZodObject<any>} schema - The `ZodObject` schema for which to generate the keys.
 *
 * @returns an object with the keys as key and the definition of the schemas as value
 */
export declare function getSchemaKeys(schema: ZodObject<any>): Record<string, string> | {
    [k: string]: Record<string, string>;
};
/**
 * Extrait les valeurs possibles des champs enum dans un schéma ZodObject
 * @param {ZodObject<any>} schema Le schéma Zod
 *
 * @returns Un objet avec les noms des champs et leurs valeurs possibles (tableaux)
 */
export declare function getEnumValues(schema: ZodObject<any>): Record<string, string[]>;
