import { getFolderContent, writeToFile } from "@adapters/files/files";

getFolderContent([process.cwd(), "site", "components"])
  .then(files => {
    const componentNames = files
      .filter(file => !file.endsWith(".ts"));
    writeToFile(process.cwd() + "/site/type.d.ts", makeContentFile(componentNames));
})

console.log('Fichier file-types.ts généré avec succès !');

function makeContentFile(componentNames: string[]) {
  let imports = "";
  let exports = "";
  let components = [];
  for (const componentName of componentNames) {
    const upperName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
    imports += "import {"+upperName+"} from \"./components/"+componentName+"/"+componentName+"\";\n";
    exports += componentName + ":"+upperName+"\n";
    components.push(upperName);


  }

  return `${imports}
export type PageData = {
${exports}
}

export type Component = "${components.join("\" | \"")}";`;
}