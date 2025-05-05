import { watch } from "chokidar";

import type { WatcherRules } from "./watcher.types";

import { EVENT } from "./watcher.constants";


/**
 * Sets up a file watcher on the specified paths and triggers a server reload
 * according to the provided reload rules when changes are detected.
 *
 * @param {string[]}     pathsToWatch    - An array of file paths to monitor for changes.
 * @param {string[]}     extensions      - An array of file extensions to watch for.
 * @param {string[]}     folders         - An array of folders to watch for.
 * @param {WatcherRules} automationRules - An object that contains rules to determine how the server should be reloaded.
 */
export function useWatcher(pathsToWatch: string[], extensions: string[], folders: string[], automationRules:WatcherRules) {
  const watcher = watch(pathsToWatch, { persistent: true });

  function extractExtension(filePath: string):string | null{
    for (const extension of extensions) {
      if (filePath.endsWith(extension)) return extension;
    }
    return null;
  }

  function extractFolder(filePath: string):string | null{
    for (const folder of folders) {
      if (filePath.includes(folder) && !filePath.endsWith(folder)) return folder;
    }
    return null;
  }

  function extractExtensionOrFolder(event: EVENT, filePath: string) {

    // return (event === EVENT.ADD_DIR || event === EVENT.UNLINK_DIR)
    //   ? extractFolder(filePath)
    //   : extractExtension(filePath);

    return extractExtension(filePath);
  }

  for (const event of Object.values(EVENT)) {
    watcher.on(event, (filePath) => {
      const extensionOrFolder = extractExtensionOrFolder(event, filePath);
      extensionOrFolder !== null && automationRules[event][extensionOrFolder]();
    });
  }

//   watcher
//     .on(EVENT.ADD, (filePath) => {
//       TODO ajouter un écouteur sur le dossier
//       automationRules[EVENT.ADD][extractExtensionOrFolder(EVENT.ADD, filePath)]
//     })
//     .on(EVENT.ADD_DIR, (filePath) => {
//       // TODO ajouter unécouteur sur le dossier
//       automationRules[EVENT.ADD_DIR][extractExtensionOrFolder(EVENT.ADD_DIR, filePath)]
//     })
//     .on(EVENT.CHANGE, (filePath) => automationRules[EVENT.CHANGE][extractExtensionOrFolder(EVENT.CHANGE, filePath)])
//     .on(EVENT.UNLINK, (filePath) => automationRules[EVENT.UNLINK][extractExtensionOrFolder(EVENT.UNLINK, filePath)])
//     .on(EVENT.UNLINK_DIR, (filePath) => automationRules[EVENT.UNLINK_DIR][extractExtensionOrFolder(EVENT.UNLINK_DIR, filePath)]);
// }
}