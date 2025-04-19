import { EVENT, EXTENSIONS, FOLDERS } from "./watcher.constants";
import { useWatcher }                 from "./watcher";
import { makeCss } from "@scripts/makeCss";

export function runWatcher(){
  useWatcher(
    [process.cwd() + "/site"],
    Object.values(EXTENSIONS),
    Object.values(FOLDERS),
    {
      // [EVENT.ADD]: {
      //   [EXTENSIONS.SCSS]: () => { }
      // },
      // [EVENT.ADD_DIR]: {
      //   [FOLDERS.COMPONENTS]: () => { },
      //   [FOLDERS.PAGES]: () => { }
      // },
      [EVENT.CHANGE]: {
        [EXTENSIONS.SCSS]: makeCss
      },
      // [EVENT.UNLINK]: {
      //   [EXTENSIONS.SCSS]: () => { }
      // },
      // [EVENT.UNLINK_DIR]: {
      //   [FOLDERS.COMPONENTS]: () => { },
      //   [FOLDERS.PAGES]: () => { }
      // }
    }
  );
}