import type { DataEntries, PageData }                                                                              from './data.type';
import      { addComponentData, loadComponentsInformation }                                                        from './components/component';
import      { dataExtension, index, localhost, pageFolder, pageSettings, projectRoot, srcPath, templateExtension } from "./constants";
import      { getFolderContent, readJsonFile }                                                                     from "@adapters/files/files";
import      { URL }                                                                                                from 'url';
// import type { PageData }                                                              from '@site';

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
 * @param url      - The URL of the page to render.
 * @param isEditor - A boolean indicating whether the page is being rendered in
 *                   editor mode, which applies additional data transformations.
 *
 * @returns An object containing the rendered content and a map of listeners.
 */
export async function renderPage(url: string, isEditor: boolean) {

  messages.length = 0;
  await loadComponentsInformation(srcPath);

  const { currentPath, templateToLoad, slug } = await extractFromUrl(url);

  try {
    const { template } = await import(`${currentPath}/${templateToLoad}${templateExtension}`) as { template: Function };
    pageData = await getPageData(currentPath, slug ? slug : index) as unknown as PageData;
    addComponentData(pageSettings, pageData.pageSettings, true);

    return isEditor
      ? renderWithEditorInterface(template)
      : minifyRenderedContent(template());
  }
  catch (error) {
    console.log("Error", error)
  }
}

/**
 * Extracts the relevant information from a given url to determine which component to load.
 *
 * @param url The url to be parsed.
 *
 * @returns An object containing the current path, the template to load and the slug (if any).
 */
async function extractFromUrl(url: string): Promise< {currentPath:string, templateToLoad:string, slug:string | undefined} > {

  const urlObj      = new URL(localhost+url);
  const cleanUrl    = urlObj.pathname;
  const currentPath = [projectRoot+pageFolder];
  const urlAsArray  = cleanUrl
    .split("/")
    .slice(1);
  let slug;
  let templateToLoad;

  for (const urlPart of urlAsArray) {
    if (urlPart === "") break;
    try{
      await getFolderContent( [...currentPath, urlPart] );
      currentPath.push(urlPart);
    }catch(e){
      templateToLoad = currentPath[currentPath.length-1]+".childs";
      slug = urlPart;
    }
  }

  if (!templateToLoad) {
    templateToLoad = index;
  }
  return  {
    currentPath : currentPath.join("/"),
    templateToLoad,
    slug
  };
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

  function listMessages() {
    return messages.length === 0
      ? ""
      : `<messages><ul>${messages.map((message) => `<li>${message}</li>`).join("\n")}</ul></messages>`;
  }

  isEditor   = true;
  editorData = {};
  const html = template();

  const scripts = /*html*/`
  <script src="/_editor/interface.js" defer></script>
  <script>
    var editorData = ${JSON.stringify(editorData)}
    var pageData   = ${JSON.stringify(pageData)}
  </script>
  <link href="/_editor/style.css" rel="stylesheet" />`;

  const extraNodes = /*html*/`
<editor>
  ${listMessages()}
</editor>
  `;

  return html
    .replace(/<head>/, `<head>${scripts}`)
    .replace("</body>", `${extraNodes}</body>`);
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

/**
 * Retrieves the page data for a given page path and slug.
 *
 * The retrieved page data is merged with the shared data, and the merged data
 * is returned.
 *
 * @param {string} pagePath - The path to the folder containing the page data.
 * @param {string} slug     - The slug of the page.
 *
 * @return {Promise<PageData>} - The merged page data.
 */
async function getPageData(pagePath:string, slug:string) {
  const pageData   = await readJsonFile(pagePath+"/"+slug+dataExtension) as PageData;
  const sharedData = await readJsonFile(projectRoot+"/shared"+dataExtension) as PageData;
  for (const [key, value] of Object.entries(sharedData)) {
    pageData[key] = { ...(pageData[key] ?? {}) , ...value } as Record<string,DataEntries> | DataEntries;
  }
  return pageData;
}

export function getComponentDataFromPageData(componentName: keyof PageData, id?: string) {
  return id !== undefined
    ? pageData[componentName]?.[id]
    : pageData[componentName];
}