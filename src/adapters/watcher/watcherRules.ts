import { EVENT, EXTENSIONS, FOLDERS } from "./watcher.constants";
import { useWatcher }                 from "./watcher";

export function runWatcher(){
  useWatcher(
    [process.cwd() + "/site"],
    Object.values(EXTENSIONS),
    Object.values(FOLDERS),
    {
      [EVENT.ADD]: {
        [EXTENSIONS.SCSS]: addScssFile
      },
      [EVENT.ADD_DIR]: {
        [FOLDERS.COMPONENTS]: () => { },
        [FOLDERS.PAGES]: () => { }
      },
      [EVENT.CHANGE]: {
        [EXTENSIONS.SCSS]: () => { }
      },
      [EVENT.UNLINK]: {
        [EXTENSIONS.SCSS]: () => { }
      },
      [EVENT.UNLINK_DIR]: {
        [FOLDERS.COMPONENTS]: () => { },
        [FOLDERS.PAGES]: () => { }
      }
    }
  );
}

function addScssFile(filePath: string) {
  console.log(`Change detected in the file : ${filePath}`);
}