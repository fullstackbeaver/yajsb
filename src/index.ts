import { componentFolder, dataExtension, index, pageFolder, projectRoot, templateExtension, templateFolder, tsExtension } from "@core/constants";
import { createDirectory, getFolderContent, getFolderContentRecursive, readFileAsString, writeToFile }                    from "@adapters/files/files";
import { firstLetterLowerCase, firstLetterUppercase }                                                                     from "@core/utils";
import { runServer }                                                                                                      from "@adapters/server/server";
import { runWatcher }                                                                                                     from "@adapters/watcher/watcherRules";

export { useComponent }      from "@core/components/component";
export { describeComponent } from "@core/components/component";
export { makeCss }           from "@scripts/makeCss";

export { renderAllPages as buildSite } from "@core/pages/page";

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
export function startYajsb(){
  runServer();
  runWatcher();
}

export const utils = {
  createDirectory,
  firstLetterLowerCase,
  firstLetterUppercase,
  getFolderContent,
  getFolderContentRecursive,
  readFileAsString,
  writeToFile
}

export const constants = {
  componentFolder,
  dataExtension,
  index,
  pageFolder,
  projectRoot,
  templateExtension,
  templateFolder,
  tsExtension
}