import { runServer }  from "@adapters/server/server";
import { updateFileTree } from "@core/siteTree";
import { runWatcher } from "@adapters/watcher/watcherRules";

runServer();
updateFileTree();
runWatcher();