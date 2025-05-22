import type { ComponentMainData, ComponentRenderData, Components, DescribeCpnArgs, ExportedComponent }                                 from "./component.types";
import      { addEditorData, addMessage, addPageData, getComponentDataFromPageData, getPageSettings, isEditorMode } from "@core/pages/page";
import      { componentFolder, projectRoot, tsExtension }                                                           from "@core/constants";
import      { getDefaultData, getEnumValues, getSchemaKeys }                                                        from "@adapters/zod/zod";
import      DOMPurify                                                                                               from "isomorphic-dompurify";
import type { ZodObject }                                                                                           from "zod";
import      { getFolderContent }                                                                                    from "@adapters/files/files";
import      { merge }                                                                                               from "@core/pages/pageData";

const components       = {} as Components;
const singleComponents = [] as string[];

const useComponentCtx = {
  addPageData : addPageData,
  components,
  dataFromPage: getComponentDataFromPageData,
  render      : render,
  sendError   : errorComponent
};

/**
 * Loads all components from the given paths.
 *
 * This function will be called only once, and only if the components object is empty.
 *
 * @param {string[]} src - an array of absolute paths where to find the components.
 *
 * @returns {Promise<void>}
 */
export async function loadComponentsInformation() {

  if (Object.keys(components).length > 0) return;

  const path          = projectRoot+componentFolder;
  const files         = await getFolderContent(path);
  const filteredFiles = files.filter(file => !file.endsWith(tsExtension)); //only folders name
  for (const file of filteredFiles) {
    components[file] = await createComponent(path, file);
  }
}

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
export function useComponent(componentName: keyof Components, id?: string, context = useComponentCtx): string {
  const { addPageData, components, dataFromPage, render , sendError } = context;

  const editorMode           = isEditorMode();
  const { schema, template } = components[componentName];

  if (template === null)      return "";

  const data = merge(
    schema && schema !== null ? getDefaultData(schema as ZodObject<any>) : {},
    dataFromPage(componentName, id) ?? {}
  );

  if (!validateComponentData(schema, data, componentName, id)) return "";

  editorMode && handleEditorMode(schema, data, componentName, id, addPageData);

  return renderComponent({ componentName, data, editorMode, id, render, template });
}

function validateComponentData(schema: any, data: any, componentName: string, id: string | undefined, sendError=errorComponent): boolean {
  if (schema !== null && hasData(data)) {
    const validation = schema.safeParse(data);
    if (!validation.success) {
      sendError("Error in " + componentName + (id !== undefined ? "." + id : "") + ": " + validation.error.message);
      return false;
    }
  }
  return true;
}

function handleEditorMode(schema: any, data: any, componentName: string, id: string | undefined, addPageData: Function) {
  if (hasData(data) && data !== null) {
    addPageData(componentName, id, data);
  }
  if (schema !== null && schema !== undefined) {
    const simplifiedSchema = getSchemaKeys(schema as ZodObject<any>);
    addEditorData(componentName, simplifiedSchema);
    ["enum", "enum?"].some(value => Object.values(simplifiedSchema).includes(value)) && addEditorData("_enum." + componentName, getEnumValues(schema as ZodObject<any>));
  }
}

/*
export function useComponent(componentName:keyof Components, id?:string, context=useComponentCtx):string{

  const { addPageData, components, dataFromPage, render, sendError } = context;

  const editorMode           = isEditorMode();
  const { schema, template } = components[componentName];  //TODO use description

  let data = dataFromPage(componentName, id);

  if ( schema === undefined && template === undefined)
    return sendError(`Component ${componentName} not found or has no schema or template`);

  if (schema === undefined && !hasData(data) && template.length > 0)
    return sendError(`Schema not found for component ${componentName}, and no data found${id !== undefined ? " for "+id : ""} in pageData`);

  data = schema !== null
    ? merge(getDefaultData(schema as ZodObject<any>), data ?? {})
    : data;

  if (schema !== null && hasData(data)) {
    const validation = schema.safeParse(data);
    if (!validation.success)
      return sendError("Error in "+componentName+(id !== undefined ? "."+id : "")+": "+validation.error.message);
  }

  if ( editorMode ) {
    hasData(data) && addPageData(componentName, id, data);
    if (schema !== null && schema !== undefined ) {
      const simplifiedSchema = getSchemaKeys(schema as ZodObject<any>);
      addEditorData(componentName, simplifiedSchema);
      ["enum", "enum?"].some(value => Object.values(simplifiedSchema).includes(value)) && addEditorData("_enum."+componentName, getEnumValues(schema as ZodObject<any>));
    }
    //TODO ajouter le description
  }

  return render({
    data,
    editorMode,
    pageSettings: getPageSettings(),
    template,
    component   : componentName,
    id
  });
}
  */

function renderComponent({ data, editorMode, template, componentName, id, render }: any): string {
  return render({
    component   : componentName,
    data,
    editorMode,
    id,
    pageSettings: getPageSettings(),
    template
  });
}

/**
 * Import a component and check if it's single or not.
 * Return the component with data or items depending on the type.
 * If single, add it to the list of single components.
 *
 * @param {string}    path         - The path to the component folder.
 * @param {string}   componentName - The name of the component.
 * @param {string[]} [SglCompCtx]  - The list of single components to update.It is defined by default and should be modified only during tests
 * @param {string}   [extension]   - The file extension of the components to update.It is defined by default and should be modified only during tests
 *
 * @returns {Promise<ComponentMainData>} - The component.
 */
async function createComponent(path: string, componentName:string, SglCompCtx:string[] = singleComponents, extension:string = tsExtension): Promise<ComponentMainData> {
  const cpn = await import(`${path}/${componentName}/${componentName}${extension}`);
  const { description, isSingle, schema, template } = cpn.default;
  isSingle === true && SglCompCtx.push(componentName);

  return { description, schema, template };
}

/**
 * Renders a component template with the given data.
 *
 * If `editorMode` is true, the rendered template will have the data-editor attribute
 * modified to include the id of the component.
 *
 * If the rendered template includes the data-editor attribute, the attribute is
 * cleaned up to remove the id suffix.
 *
 * @param {ComponentRenderData} componentRenderData - The data to render the component with.
 *
 * @returns {string} The rendered template as a string.
 */
function render({ data, editorMode, pageSettings, component, id, template }:ComponentRenderData) {

  const result = template({
    [component]: data,
    pageSettings
  });

  if (editorMode) {
    const dynamicPattern = new RegExp(`data-editor="${component}(.*?)"`, "g");
    const editorResult = id !== undefined
      ? result.replace(dynamicPattern, (_: any, p1: string) => { return `data-editor="${component}${p1}.${id}"`; })
      : result;
    return editorResult;
  }

  if (!result.includes("data-editor")) return result;

  const domFragment = DOMPurify.sanitize(result, { RETURN_DOM_FRAGMENT: true });
  for (const element of Array.from( domFragment.querySelectorAll("[data-editor]"))) {
    element.setAttribute("data-editor", element.getAttribute("data-editor")!.replace(/-[^-]+$/, ""));
  }
  return DOMPurify.sanitize(result);
}

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
function errorComponent(msg: string) {
  addMessage(msg);
  return "";
}

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
export function describeComponent(description:DescribeCpnArgs){
  return JSON.stringify(description);
}

/**
 * Checks if a given object has any data or is set to null.
 *
 * This function checks if the given object is truthy and if its keys length is greater than 0.
 *
 * @param {object | undefined | null} data - The object to check.
 *
 * @returns {boolean} True if the object has data, false otherwise.
 */
function hasData(data:object | undefined | null){
  return data !== null && data !== undefined && Object.keys(data).length > 0;
}

/**
 * Returns the schema definition of the page settings component.
 *
 * This function returns the schema keys of the page settings component.
 * The schema keys are the keys of the object that describe the structure
 * of the page settings component.
 *
 * @returns {Record<string, ZodType<any>>} The schema keys of the page settings component.
 */
export function getPageSettingsEditor() {
  return getSchemaKeys(components.pageSettings.schema as ZodObject<any>);
}

export function getComponentByName(name:string){
  return components[name];
}

export function component(template: Function | null, schema: ZodObject<any> | null = null, isSingle = true): ExportedComponent {
  return {
    isSingle,
    schema,
    template
  };
}