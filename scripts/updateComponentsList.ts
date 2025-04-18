import { componentFolder, projectRoot }                             from "@core/constants";
import { getFolderContent, getFolderContentRecursive, writeToFile } from "@adapters/files/files";

switch (process.argv[2]) {
  case "add":
    await add(process.argv[3], process.argv[4], process.argv[5] === "true");
    break;
  case "types":
    makeContentFile();
    break;
  case "scss":
    updateScssComponentsList();
    break;
  default:
    process.argv[2] !== undefined && console.error("Unknown argument passed:", process.argv[2]);
}


async function makeContentFile() {
  let   imports    = "";
  let   exports    = "";
  const components = await findFolders();

  for (const componentName of components) {
    const upperName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
    imports += "import {"+upperName+"} from \"./components/"+componentName+"/"+componentName+"\";\n";
    exports += componentName + ":"+upperName+"\n";
  }

  writeToFile(process.cwd() + "/site/type.d.ts",  `// do not change this file, auto generated
${imports}
export type PageData = {
${exports}
}
export type Component = "${components.join("\" | \"")}";`);

  console.log('Fichier file-types.ts généré avec succès !');
}

async function findFolders() {
  return await getFolderContent(projectRoot + componentFolder);
}

export async function updateScssComponentsList() {
  const { components } = await getFolderContentRecursive(projectRoot + componentFolder);
  const folders        = await findFolders();
  writeToFile(projectRoot + "/css/components.scss", folders
    .filter(folder => (components as any).folders[folder].styles.length > 0)
    .map(folder => `@use "../components/${folder}/${folder}";`)
    .join("\n")
  );

  console.log('Fichier component.scss mis à jour avec succès !');
}

export function add(type:"page"|"component", name:string, multiple:boolean) {
  if (type !== "page" && type !== "component") throw new Error("Invalid type");
  if (name === "true" || name === "false" || name === undefined) throw new Error("Invalid name");
  if (multiple === undefined) throw new Error("Invalid multiple");

  console.log("Add", type, name, multiple);
}