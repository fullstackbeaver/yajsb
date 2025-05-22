import type { WatcherRules } from "./watcher.types";
/**
 * Sets up a file watcher on the specified paths and triggers a server reload
 * according to the provided reload rules when changes are detected.
 *
 * @param {string[]}     pathsToWatch    - An array of file paths to monitor for changes.
 * @param {string[]}     extensions      - An array of file extensions to watch for.
 * @param {string[]}     folders         - An array of folders to watch for.
 * @param {WatcherRules} automationRules - An object that contains rules to determine how the server should be reloaded.
 */
export declare function useWatcher(pathsToWatch: string[], extensions: string[], folders: string[], automationRules: WatcherRules): void;
