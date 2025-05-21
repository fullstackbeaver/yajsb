import type { DataEntries, PageData, PartitalPageUpdateArgs }                        from "./pages.types";
import      { formatDataToSave, loadPagesData, loadSharedData, merge }               from "./pageData";
import      { getComponentByName, getPageSettingsEditor, loadComponentsInformation } from "../components/component";
import      { writeJson, writeToFile }                                               from "@adapters/files/files";
import      { JSDOM }                                                                from "jsdom";
import type { ZodObject }                                                            from "zod";
import      { extractFromUrl }                                                       from "./url";
import      { getDefaultData }                                                       from "@adapters/zod/zod";
import      { getFileTree }                                                          from "@core/siteTree";
import      { pageSettings }                                                         from "@core/constants";

const messages     = [] as string[];
const usedPageData = {} as any;       // les données complétées par les schemas //TODO remettre le bon typage
let   editorData   = {} as any;       //TODO remettre le bon typage
let   isEditor     = false;
let   pageData     = {} as any;       //TODO remettre le bon typage;

/**
 * Renders a page based on the provided URL and editor mode.
 *
 * This function loads components and clears existing listeners. It then extracts
 * the relevant path and template information from the URL, dynamically imports
 * the template, and loads the appropriate page data (applying editor transformations
 * if in editor mode). Finally, it renders the template and returns the rendered
 * content alongside any listeners.
 *
 * @param {string}  url      - The URL of the page to render.
 * @param {Boolean} isEditor - A boolean indicating whether the page is being rendered in
 *                   editor mode, which applies additional data transformations.
 *
 * @returns An object containing the rendered content and a map of listeners.
 */
export async function renderPage(url: string, isEditor: boolean) {

  messages.length = 0;
  await loadComponentsInformation();

  const { dataToLoad, templateToLoad } = await extractFromUrl(url);

  try {
    const { template } = await import(templateToLoad) as { template: Function };
    pageData           = merge(await loadPagesData(dataToLoad), await loadSharedData());

    if (pageData.pageSettings === undefined || Object.keys(pageData.pageSettings).length === 0){
      pageData.pageSettings = getDefaultData(getComponentByName(pageSettings).schema as ZodObject<any>);
    }

    return isEditor
      ? renderWithEditorInterface(template)
      : minifyRenderedContent(template());
  }
  catch (error) {
    console.log("Error", error);
  }
}

/**
 * Minify the rendered content by removing unnecessary whitespaces.
 *
 * This function takes a rendered string and removes the following:
 *   - Unnecessary line breaks
 *   - Multiple spaces
 *   - Spaces around HTML tags
 *   - Spaces at the beginning and end of the string
 *
 * @param {string} str - The rendered string to be minified.
 *
 * @returns {string}     The minified string.
 */
function minifyRenderedContent(str:string) {
  if (typeof str !== "string") return str;

  return str
    .replace(/\n+/g, " ")     // Supprimer les retours à la ligne inutiles
    .replace(/\s{2,}/g, " ")  // Supprimer les espaces multiples
    .replace(/>\s+</g, "><")  // Supprimer les espaces autour des balises
    .trim();
}

/**
 * Enhances and renders the template with editor-specific functionality.
 *
 * This function sets the editor mode, prepares editor-related data, and injects
 * necessary scripts and styles into the HTML template for the editor interface.
 *
 * @param {Function} template - The template function to render the HTML content.
 *
 * @returns {string} The HTML string with injected editor scripts and styles.
 */
function renderWithEditorInterface(template:Function) {

  isEditor   = true;
  editorData = {
    pageSettings: getPageSettingsEditor()
  };
  usedPageData.pageSettings = pageData.pageSettings;

  const html = template();

  const scripts = /*html*/`
  <script src="https://cdn.tiny.cloud/1/2twbfyfjocws7ln2yp1xbioznajuwpd2obek1kwsiev66noc/tinymce/7/tinymce.min.js" referrerpolicy="origin"></script>

  <script src="/_editor/interface.js" defer></script>
  <script>
    var editorData = ${JSON.stringify(editorData)}
    var pageData   = ${JSON.stringify(usedPageData)}
    var messages   = ${JSON.stringify(messages)}
  </script>
  <link href="/_editor/style.css" rel="stylesheet" />`;

  return html
    .replace(/<head>/, `<head>${scripts}`);
}

/**
 * Adds a message to the messages array.
 *
 * These messages are made available to the client-side script as a JSON
 * array of strings. The client-side script can then display them in the
 * editor interface.
 *
 * @param {string} message - The message to add to the messages array.
 */
export function addMessage(message:string) {
  messages.push(message);
}

/**
 * Checks if the current render is in editor mode.
 *
 * Editor mode is enabled when the page is being rendered for the admin
 * interface. In this case, the page is enhanced with editor-specific
 * functionality, such as TinyMCE script injection and data transformation.
 *
 * @returns {boolean} True if the current render is in editor mode.
 */
export function isEditorMode() {
  return isEditor;
}

/**
 * Adds data to the `editorData` object for a specified component.
 *
 * This function updates the `editorData` object by setting the data
 * associated with the given component. The data can be of any type
 * as it is stored under the component's name in the `editorData` object.
 *
 * @param {string}  component - The name of the component to associate the data with.
 * @param {unknown} data - The data to store for the specified component.
 */
export function addEditorData(component:string, data:unknown){
  editorData[component] = data;
}

/**
 * Adds data to the `usedPageData` object for a specified component.
 *
 * This function updates the `usedPageData` object by setting the data
 * associated with the given component and optional identifier. If an
 * identifier is provided, the data is stored under that specific id.
 * Otherwise, the data is stored directly under the component's name.
 *
 * @param {string}             component - The name of the component to associate the data with.
 * @param {string | undefined} id        - The unique identifier for the component data, if any.
 * @param {DataEntries}        data      - The data entries to store for the specified component.
 */

export function addPageData(component:string, id:string | undefined, data:DataEntries) {
  usedPageData[component] ??= {};
  if (id !== undefined) usedPageData[component][id] = data;
  else usedPageData[component] = data;
}

/**
 * Retrieves the data associated with a given component name and optional identifier.
 *
 * If an identifier is provided, this function returns the data associated with that
 * specific id under the given component name. Otherwise, it returns all the data
 * associated with the given component name.
 *
 * @param {keyof PageData}     componentName - The name of the component to retrieve data from.
 * @param {string | undefined} id            - The unique identifier for the component data, if any.
 *
 * @returns {DataEntries | undefined} The retrieved data, or undefined if no data is found.
 */
export function getComponentDataFromPageData(componentName: keyof PageData, id?: string) {
  return id !== undefined
    ? pageData[componentName]?.[id]
    : pageData[componentName];
}

/**
 * Retrieves the page settings data from the page data object.
 *
 * @returns {Record<string, DataEntries> | undefined} The page settings data, or undefined if no page settings data is found.
 */
export function getPageSettings(){
  return pageData.pageSettings;
}

/**
 * Partially updates a page with new data and re-renders it.
 *
 * This function takes a component name, its associated data, the editor data,
 * and the URL of the page to update. It first extracts the template to load
 * and the data to load from the URL. Then, it formats the data to save and its
 * target location, and writes the data to that location.
 *
 * After that, it prepares the data for re-rendering by setting the page data
 * to the union of the shared data and the page data, and then renders the page
 * with the new data.
 *
 * @param {{ component: string; data: DataEntries; editorData: string; url: string; }} partitalPageUpdateArgs
 *   - The component name, its associated data, the editor data, and the URL
 *     of the page to update.
 *
 * @returns {Promise<{ content: string; pageData: PageData; messages: string[]; }>}
 *   - A promise resolving to an object with the rendered content, the page
 *     data, and any messages that were generated during the update.
 */
export async function partialPageUpdate( { component, data, editorData, url }:PartitalPageUpdateArgs ){

  const { templateToLoad, dataToLoad }         = await extractFromUrl(url);
  const { dataToSave, isSharedData, target } = await formatDataToSave(dataToLoad, data, component, editorData );
  await writeJson(target, dataToSave);

  // prepare data for render
  messages.length  = 0;
  const dataShared = isSharedData
    ?  dataToSave
    :  await loadPagesData(target);
  const dataPage = isSharedData
    ?  await loadPagesData(dataToLoad)
    :  dataToSave;
  pageData = merge(dataPage, dataShared);

  //new render
  const { template } = await import(templateToLoad) as { template: Function };
  const page         = await template();
  const pageDom      = new JSDOM(page).window.document;

  return {
    content: minifyRenderedContent((pageDom.querySelector("body") as HTMLElement).innerHTML),
    messages,
    pageData
  };
}

export async function renderAllPages() {
  const pageList = await getFileTree(false, false);
  for (const page of pageList) {
    const rendered        = await renderPage(page, false);
    const { fileToWrite } = await extractFromUrl(page);
    writeToFile(fileToWrite, rendered);
  }
}