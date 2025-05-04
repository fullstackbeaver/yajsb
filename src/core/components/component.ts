import type { ComponentMainData, ComponentRenderData, Components, DescribeCpnArgs }                                 from "./component.types";
import      { addEditorData, addMessage, addPageData, getComponentDataFromPageData, getPageSettings, isEditorMode } from "@core/pages/page";
import      { componentFolder, projectRoot, tsExtension }                                                           from "@core/constants";
import      { getDefaultData, getEnumValues, getSchemaKeys }                                                        from "@adapters/zod/zod";
import      DOMPurify                                                                                               from 'isomorphic-dompurify';
import type { ZodObject }                                                                                           from "zod";
import      { getFolderContent }                                                                                    from "@adapters/files/files";

const components       = {} as Components;
const singleComponents = [] as string[];

const useComponentCtx = {
  addMmsg         : addMessage,
  addPageData     : addPageData,
  components,
  dataFromPage    : getComponentDataFromPageData,
  render          : render,
  sendError       : errorComponent
}


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
 *    - addMmsg: adds a message to the messages array.
 *    - addPageData: adds the component data to the page data map.
 *    - dataFromPage: returns the component data from the page data map.
 *    - render: renders the template with the given data.
 *    - sendError: sends an error message to the messages array.
 *
 *    context is defined by default and should be modified only during tests
 *
 * @returns {string} The rendered template as a string.
 */
export function useComponent(componentName:keyof Components, id?:string, context=useComponentCtx):string{

  const { addMmsg, addPageData, components, dataFromPage, render, sendError } = context;

  const editorMode           = isEditorMode();
  const { schema, template } = components[componentName];  //TODO use description

  let data = dataFromPage(componentName, id);

  if ( schema === undefined && template === undefined)
    return sendError(`Component ${componentName} not found or has no schema or template`);

  if (schema === undefined && !hasData(data) && template.length > 0)
    return sendError(`Schema not found for component ${componentName}, and no data found${id !== undefined ? " for "+id : ""} in pageData`);

  if (schema !== null && hasData(data)) {
    const validation = schema.safeParse(data);
    if (!validation.success)
      return sendError("Error in "+componentName+(id !== undefined ? "."+id : "")+": "+validation.error.message);
  }

  if (schema !== null && !hasData(data)) {
    data = getDefaultData(schema as ZodObject<any>);
    addMmsg("default values used for "+componentName+(id !== undefined ? "."+id : ""));
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
    component: componentName,
    id
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
  const { description, isSingle, schema, template } = await import(`${path}/${componentName}/${componentName}${extension}`);
  isSingle === true && SglCompCtx.push(componentName);

  return { description, schema, template }
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
function render({data, editorMode, pageSettings, component, id, template}:ComponentRenderData) {

  const result = template({
    [component] : data,
    pageSettings
  });

  if (editorMode) {
    const dynamicPattern = new RegExp(`data-editor="${component}(.*?)"`, 'g');
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
 * Checks if a given object has any data.
 *
 * This function checks if the given object is truthy and if its keys length is greater than 0.
 *
 * @param {object | undefined} data - The object to check.
 *
 * @returns {boolean} True if the object has data, false otherwise.
 */
function hasData(data:object | undefined){
  if (!data || data === undefined) return false;
  if (Object.keys(data).length > 0 ) return true;
  return false;
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