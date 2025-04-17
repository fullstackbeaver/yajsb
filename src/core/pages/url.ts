import { dataExtension, index, localhost, pageFolder, projectRoot, templateExtension } from "@core/constants";
import { getFolderContent }                                                            from "@adapters/files/files";
import { join }                                                                        from 'path';


type ExtractFromUrlResponse = {
  templateToLoad: string;
  dataToLoad: string;
}

/**
 * Takes a URL and extract the template and data to load.
 *
 * Algorithm:
 * - Take the last part of the URL as the data to load.
 * - Then, go up in the URL path and try to find a folder with the same name.
 *   - If found, keep going until we reach the last part of the URL.
 *   - If not found, break the loop and use the last part of the URL as the data to load.
 * - Set the template to load as the last part of the URL without the extension.
 * - If the URL is "/" or the last part of the URL is the same as the index,
 *   - Set the template and data to load as the index.
 *
 * @param {string} url The URL to extract the template and data from.
 *
 * @returns {Promise<ExtractFromUrlResponse>} An object with the template to load and the data to load.
 */
export async function extractFromUrl(url: string): Promise<ExtractFromUrlResponse> {
  const cleanUrl    = new URL(localhost + url).pathname;
  const currentPath = [projectRoot, pageFolder];
  const urlAsArray  = cleanUrl
    .split("/")
    .slice(1)
    .filter((part) => part !== "");

  let dataToLoad     = urlAsArray[urlAsArray.length - 1];  // dernier élément ou undefined
  let templateToLoad = "";

  for (const urlPart of urlAsArray) {
    try {
      await getFolderContent([...currentPath, urlPart]);
      currentPath.push(urlPart);
    } catch (e) {
      templateToLoad = `${currentPath[currentPath.length - 1]}.childs`;
      dataToLoad = urlPart;
      break;
    }
  }

  const baseSrc = join(...currentPath);

  if (!templateToLoad) {
    const lastEntry = urlAsArray[urlAsArray.length - 1];
    if (urlAsArray.length > 0 && dataToLoad === lastEntry) {
      templateToLoad += `${lastEntry}.`;
      dataToLoad      = `${lastEntry}.${index}`;
    } else {
      dataToLoad = index;
    }
    templateToLoad += index;
  }

  // Cas où l’URL est "/"
  if (urlAsArray.length === 0) {
    dataToLoad = index;
    templateToLoad = index;
  }

  return {
    templateToLoad: join(baseSrc, templateToLoad + templateExtension),
    dataToLoad    : join(baseSrc, dataToLoad + dataExtension),
  };
}