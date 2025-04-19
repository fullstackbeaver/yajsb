import { runServer }      from "@adapters/server/server";
import { runWatcher }     from "@adapters/watcher/watcherRules";
import { updateFileTree } from "@core/siteTree";

runServer();
updateFileTree();
runWatcher();