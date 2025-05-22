type ExtractFromUrlResponse = {
    dataToLoad: string;
    fileToWrite: string;
    templateToLoad: string;
};
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
export declare function extractFromUrl(url: string): Promise<ExtractFromUrlResponse>;
export {};
