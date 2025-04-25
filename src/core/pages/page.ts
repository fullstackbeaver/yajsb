import type { DataEntries, PageData, PartitalPageUpdateArgs }      from './pages.types';
import      { dataExtension, projectRoot, sharedIndex, sharedKey } from "../constants";
import      { readJsonFile, writeJson }                            from "@adapters/files/files";
import      { JSDOM }                                              from 'jsdom';
import      { extractFromUrl }                                     from './url';
import      { getPageSettingsEditor, loadComponentsInformation }   from '../components/component';
import      { merge }                                              from '@core/utils';
import      { sanitizeInput }                                      from 'ls4bun';

const messages     = [] as string[];
let   editorData   = {} as any;       //TODO remettre le bon typage
let   isEditor     = false;
let   pageData     = {} as any        //TODO remettre le bon typage;
let   usedPageData = {} as any;       // les données complétées par les schemas //TODO remettre le bon typage

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

  const { templateToLoad, dataToLoad } = await extractFromUrl(url);

  try {
    const { template } = await import(templateToLoad) as { template: Function };
    pageData           = await loadPagesData(dataToLoad);
    const sharedData   = await loadSharedData();
    for (const [key, value] of Object.entries(sharedData)) {
      pageData[key] = { ...(pageData[key] ?? {}) , ...value } as Record<string,DataEntries> | DataEntries;
    }

    return isEditor
      ? renderWithEditorInterface(template)
      : minifyRenderedContent(template());
  }
  catch (error) {
    console.log("Error", error)
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
    .replace(/\n+/g, ' ')     // Supprimer les retours à la ligne inutiles
    .replace(/\s{2,}/g, ' ')  // Supprimer les espaces multiples
    .replace(/>\s+</g, '><')  // Supprimer les espaces autour des balises
    .trim();
}

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
    .replace(/<head>/, `<head>${scripts}`)
}

export function addMessage(message:string) {
  messages.push(message);
}

export function isEditorMode() {
  return isEditor;
}

export function addEditorData(component:string, data:unknown){
  editorData[component] = data;
}

export function addPageData(component:string, id:string | undefined, data:DataEntries) {
  usedPageData[component] ??= {};
  if (id !== undefined) usedPageData[component][id] = data;
  else usedPageData[component] = data;
}

async function loadSharedData() {
  return await readJsonFile(projectRoot+"/"+sharedKey+dataExtension) as PageData;
}

async function loadPagesData(path:string) {
  return await readJsonFile(path) as PageData;
}

export function getComponentDataFromPageData(componentName: keyof PageData, id?: string) {
  return id !== undefined
    ? pageData[componentName]?.[id]
    : pageData[componentName];
}

export function getPageSettings(){
  return pageData.pageSettings;
}

export async function partialPageUpdate( { component, data, editorData, id, url }:PartitalPageUpdateArgs ){

  function reformatComponentData() {
    if (component === editorData)
      return { [component]: sanitizeInput(data) };

    const [_component, editor, id] = editorData.split(".") as [string, string, string | undefined];

    return id === undefined
      ? { [component]: { [editor]: sanitizeInput(data) } }
      : { [component]: { [id]: { [editor]: sanitizeInput(data) } } };
  }

  const { dataToLoad, templateToLoad } = await extractFromUrl(url);
  const isShared                       = id && id.startsWith(sharedIndex);
  const originalData                   = isShared
    ? await loadSharedData()
    : await loadPagesData(dataToLoad);

  const newData = merge(originalData, reformatComponentData());

  if (!isShared) {
    newData.pageSettings.modificationDate = new Date().toISOString();
  }

  //save
  await writeJson(dataToLoad, newData);

  //new render
  pageData =  merge(pageData, newData); //merge for adding others data (shared or page data)
  messages.length = 0;
  const { template } = await import(templateToLoad) as { template: Function };

  const page    = await template();
  const pageDom = new JSDOM(page).window.document;
  const content = (pageDom.querySelector("body") as HTMLElement).innerHTML;

  return {
    content: minifyRenderedContent(content),
    pageData,
    messages
  }

}