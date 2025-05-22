import type { ComponentMainData, ComponentRenderData, Components, DescribeCpnArgs, ExportedComponent } from "./component.types";
import { getComponentDataFromPageData } from "../pages/page";
import type { ZodObject } from "zod";
/**
 * Loads all components from the given paths.
 *
 * This function will be called only once, and only if the components object is empty.
 *
 * @param {string[]} src - an array of absolute paths where to find the components.
 *
 * @returns {Promise<void>}
 */
export declare function loadComponentsInformation(): Promise<void>;
/**
 * Renders a component using the specified component name and id.
 *
 * This hook will fetch the component data based on the provided component
 * name, id, and page data schema, and finally render the template with this
 * data.
 *
 * @param {string}                 componentName  - The name of the component to render.
 * @param {string}                 [id]           - The unique identifier for the component data.
 * @param {Record<string,Function>}[context]      - The context containing the following functions:
 *    - addPageData: adds the component data to the page data map.
 *    - dataFromPage: returns the component data from the page data map.
 *    - render: renders the template with the given data.
 *
 *    context is defined by default and should be modified only during tests
 *
 * @returns {string} The rendered template as a string.
 */
export declare function useComponent(componentName: keyof Components, id?: string, context?: {
    addPageData: typeof import("../pages/page").addPageData;
    components: Components;
    dataFromPage: typeof getComponentDataFromPageData;
    render: ({ data, editorMode, pageSettings, component, id, template }: ComponentRenderData) => any;
    sendError: typeof errorComponent;
}): string;
/**
 * Logs an error message and returns an empty string.
 *
 * This is a utility function for returning a value from a component
 * when an error occurs.
 *
 * @param {string} msg - The message to log as an error.
 *
 * @returns {string} An empty string.
 */
declare function errorComponent(msg: string): string;
/**
 * Stringifies a component description object to a JSON string.
 *
 * This is a utility function for storing a component description object
 * in a file or database.
 *
 * @param {DescribeCpnArgs} description - The component description object
 * to stringify.
 *
 * @returns {string} The JSON string representation of the object.
 */
export declare function describeComponent(description: DescribeCpnArgs): string;
/**
 * Returns the schema definition of the page settings component.
 *
 * This function returns the schema keys of the page settings component.
 * The schema keys are the keys of the object that describe the structure
 * of the page settings component.
 *
 * @returns {Record<string, ZodType<any>>} The schema keys of the page settings component.
 */
export declare function getPageSettingsEditor(): Record<string, string> | {
    [k: string]: Record<string, string>;
};
export declare function getComponentByName(name: string): ComponentMainData;
export declare function component(template: Function | null, schema?: ZodObject<any> | null, isSingle?: boolean): ExportedComponent;
export {};
