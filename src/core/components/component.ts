import type { ComponentRenderData, Components, ComponentWithChild, ComponentWithoutChild } from "./component.types";
import      { addMessage, addPageData, getComponentDataFromPageData, isEditorMode }        from "@core/page";
import      DOMPurify                                                                      from 'isomorphic-dompurify';
import      { getDefaultData }                                                             from "@adapters/zod/zod";
import      { getFolderContent }                                                           from "@adapters/files/files";
import      { tsExtension }                                                                from "@core/constants";

const components       = {} as Components;
const singleComponents = [] as string[];

const useComponentCtx = {
  addComponentData: addComponentData,
  addMmsg         : addMessage,
  addPageData     : addPageData,
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
export async function loadComponentsInformation(src: string[]) {

  if (Object.keys(components).length > 0) return;

  for (const endPath of src) {
    const path          = process.cwd() + endPath;
    const files         = await getFolderContent(path);
    const filteredFiles = files.filter(file => !file.endsWith(tsExtension));
    for (const file of filteredFiles) {
      components[file] = await createComponent(path, file);
    }
  }
}

/**
 * Renders a component using the specified component name and id.
 *
 * This hook will fetch the component data based on the provided component
 * name, id, and page data schema, and finally render the template with this
 * data.
 *
 * @param {string}                 componentName     - The name of the component to render.
 * @param {string}                 [id]              - The unique identifier for the component data.
 * @param {Record<string,Function>}[useComponentCtx] - The context containing the following functions:
 *    - addComponentData: adds the component data to the component data map.
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
export function useComponent(componentName:keyof Components, id?:string, {addComponentData, addMmsg, addPageData, dataFromPage, render, sendError}=useComponentCtx):string{

  const editorMode                                       = isEditorMode();
  const { description, schema, template, wrapperEditor } = components[componentName];  //TODO use description and wrapperEditor
  let   data                                             = id
    ? (components?.[componentName] as ComponentWithChild).items?.[id]
    : (components?.[componentName] as ComponentWithoutChild)?.data
  const dataFromComponents = data !== undefined;

  if (!dataFromComponents) data = dataFromPage(componentName, id);

  if ( schema == undefined && template === undefined)
    return sendError(`Component ${componentName} not found or has no schema or template`);

  if ((schema === undefined || schema === null) && data === undefined)
    return sendError(`Schema not found for component ${componentName}, and no data found${id !== undefined ? " for "+id : ""} in pageData`);

  if (schema !== null) {
    if (data !== undefined) {

      const validation = schema.safeParse(data);
      if (!validation.success)
        return sendError("Error in "+componentName+(id !== undefined ? "."+id : "")+": "+validation.error.message);
    }
    else {
      data = getDefaultData(schema);
      addMmsg("default values used for "+componentName+(id !== undefined ? "."+id : ""));
    }
  }

  ! dataFromComponents && addComponentData(componentName, data);

  if ( editorMode ) {
    addPageData(componentName, id, data);
    //TODO ajouter le wrapperEditor et description
  }

  return render({
    data,
    editorMode,
    pageSettings: (components.pageSettings as ComponentWithoutChild).data,
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
 *
 * @returns {Promise<ComponentWithChild | ComponentWithoutChild>} - The component.
 */
async function createComponent(path: string, componentName:string, SglCompCtx:string[] = singleComponents): Promise<ComponentWithChild | ComponentWithoutChild> {
  const { description, isSingle, schema, template, wrapperEditor } = await import(`${path}/${componentName}/${componentName}${tsExtension}`);
  isSingle === true && SglCompCtx.push(componentName);

  return isSingle === true
    ? { description, schema, template, wrapperEditor, data  : {} }
    : { description, schema, template, wrapperEditor, items : {} }
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
    const editorResult = id !== undefined
      ? result.replace(/data-editor="(.*?)"/g, (_: any, p1:string) => { return `data-editor="${p1}.${id}"`; })
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
 * Adds data to a component.
 *
 * If the component is a single component, the data is added as a whole.
 * If the component is a component with children, the data is added as items.
 *
 * @param {string}     componentName - The name of the component.
 * @param {any}        data          - The data to add to the component.
 * @param {boolean}    [forceSingle] - If true, the component will be treated as a single component.
 * @param {Components} [cpnCtx]      - The context of components. should be modified only during tests
 *
 * @returns {void}
 */
export function addComponentData(componentName: string, data:any, forceSingle= false, cpnCtx = components) {
  if (singleComponents.includes(componentName) || forceSingle) {
    (cpnCtx[componentName] as ComponentWithoutChild).data = data;
  }else {
    (cpnCtx[componentName] as ComponentWithChild).items = data;
  }
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

// function extractDataEditorValues(html: string): string[] {
//   const regex = /data-editor="(.*?)"/g;
//   const matches = [];
//   let match;

//   while ((match = regex.exec(html)) !== null) {
//     matches.push(match[1]);
//   }

//   return matches;
// }

