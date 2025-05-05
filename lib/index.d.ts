import { createDirectory, getFolderContent, getFolderContentRecursive, readFileAsString, writeToFile } from "@adapters/files/files";
import { firstLetterLowerCase, firstLetterUppercase } from "@core/utils";
export { useComponent } from "@core/components/component";
export { describeComponent } from "@core/components/component";
export { makeCss } from "@scripts/makeCss";
/**
 * Initializes and starts the Yajsb application server and its associated components.
 *
 * This function performs the following actions:
 * 1. Starts the server to handle incoming client requests.
 * 2. Updates the file tree to reflect the current project structure.
 * 3. Begins watching for file changes to trigger necessary rebuilds or updates.
 *
 * @returns {Promise<void>} A promise that resolves when all initialization steps are completed.
 */
export declare function startYajsb(): Promise<void>;
export declare const utils: {
    createDirectory: typeof createDirectory;
    firstLetterLowerCase: typeof firstLetterLowerCase;
    firstLetterUppercase: typeof firstLetterUppercase;
    getFolderContent: typeof getFolderContent;
    getFolderContentRecursive: typeof getFolderContentRecursive;
    readFileAsString: typeof readFileAsString;
    writeToFile: typeof writeToFile;
};
export declare const constants: {
    componentFolder: string;
    dataExtension: string;
    index: string;
    pageFolder: string;
    projectRoot: string;
    templateExtension: string;
    templateFolder: string;
    tsExtension: string;
};
