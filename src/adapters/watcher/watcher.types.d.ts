import { EVENT } from "./watcher.constants";

type WatcherRules = {
  [event in EVENT]: {
    [extensionOrContain : string] : Function
  }
}