import { componentFolder, dataExtension, index, pageFolder, projectRoot, templateExtension, templateFolder, tsExtension } from "@core/constants";
import { createDirectory, getFolderContent, getFolderContentRecursive, readFileAsString, writeToFile }                    from "@adapters/files/files";
import { firstLetterLowerCase, firstLetterUppercase }                                                                     from "@core/utils";
import { runServer }                                                                                                      from "@adapters/server/server";
import { runWatcher }                                                                                                     from "@adapters/watcher/watcherRules";
import { updateFileTree }                                                                                                 from "@core/siteTree";

export { useComponent }      from "@core/components/component";
export { describeComponent } from "@core/components/component";
export { makeCss }           from "@scripts/makeCss";

export async function startYajsb(){
  runServer();
  await updateFileTree();
  runWatcher();
}

export const utils = {
  firstLetterLowerCase,
  firstLetterUppercase,
  createDirectory, getFolderContent, getFolderContentRecursive, readFileAsString, writeToFile
}

export const constants = { componentFolder, dataExtension, index, pageFolder, projectRoot, templateExtension, templateFolder, tsExtension }