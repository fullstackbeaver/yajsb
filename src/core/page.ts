import { URL } from 'url';

import { basePage, index, srcPath, templateExtension }               from "./constants";
import { completePageData, getGlobalData, getComponentData, setPageData, hasSharedData, setSharedData } from './data/data';
import { findComponents, getComponent }                              from './components/component';
import { getFolderContent, readJsonFile }                            from "@adapters/files/files";

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

  await findComponents(srcPath);

  const { currentPath, templateToLoad, slug } = await extractFromUrl(url);

  try {
    const { template } = await import(`${currentPath}/${templateToLoad}${templateExtension}`) as { template: Function };
    setPageData(await readJsonFile(`${currentPath}/${slug ? slug : index}.data.json`));
    !hasSharedData() && setSharedData(await readJsonFile(process.cwd() + "/shared.data.json"));

    return {
      listeners: isEditor ? completePageData() : undefined,
      render   : minifyRenderedContent(template())
    };
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

  const urlObj      = new URL("http://localhost"+url);
  const cleanUrl    = urlObj.pathname;
  const currentPath = [basePage];
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
 * Renders a component's template with the associated data.
 *
 * @param componentName - The name of the component to be used.
 * @param id            - The identifier for the specific component data to be used.
 *
 * @returns The rendered template of the component with the provided data.
 */
export function useComponent(componentName:string, id:string){
  const { template, schema } = getComponent(componentName);
  return template({
    global         : getGlobalData(),
    [componentName]: getComponentData(componentName, id, schema)
  });
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
