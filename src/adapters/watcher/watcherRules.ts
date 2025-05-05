import { EVENT, EXTENSIONS, FOLDERS } from "./watcher.constants";
import { makeCss }                    from "@scripts/makeCss";
import { useWatcher }                 from "./watcher";

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