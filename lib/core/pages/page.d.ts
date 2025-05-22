import type { DataEntries, PageData, PartitalPageUpdateArgs } from "./pages.types";
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
export declare function renderPage(url: string, isEditor: boolean): Promise<any>;
/**
 * Adds a message to the messages array.
 *
 * These messages are made available to the client-side script as a JSON
 * array of strings. The client-side script can then display them in the
 * editor interface.
 *
 * @param {string} message - The message to add to the messages array.
 */
export declare function addMessage(message: string): void;
/**
 * Checks if the current render is in editor mode.
 *
 * Editor mode is enabled when the page is being rendered for the admin
 * interface. In this case, the page is enhanced with editor-specific
 * functionality, such as TinyMCE script injection and data transformation.
 *
 * @returns {boolean} True if the current render is in editor mode.
 */
export declare function isEditorMode(): boolean;
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
export declare function addEditorData(component: string, data: unknown): void;
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
export declare function addPageData(component: string, id: string | undefined, data: DataEntries): void;
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
export declare function getComponentDataFromPageData(componentName: keyof PageData, id?: string): any;
/**
 * Retrieves the page settings data from the page data object.
 *
 * @returns {Record<string, DataEntries> | undefined} The page settings data, or undefined if no page settings data is found.
 */
export declare function getPageSettings(): any;
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
export declare function partialPageUpdate({ component, data, editorData, url }: PartitalPageUpdateArgs): Promise<{
    content: string;
    messages: string[];
    pageData: any;
}>;
export declare function renderAllPages(): Promise<void>;
