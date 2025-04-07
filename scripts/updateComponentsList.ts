import { getFolderContent, writeToFile } from "src/adapters/files/files";

getFolderContent([process.cwd(), "site", "components"])
  .then(files => {
    const componentNames = [...files, "Global"]
      .filter(file => !file.endsWith(".ts"))
      .map(file => file.charAt(0).toUpperCase() + file.slice(1))
      .join("' | '");
    writeToFile(process.cwd() + "/site/components/type.d.ts", `export type Component = '${componentNames}';`)
})

console.log('Fichier file-types.ts généré avec succès !');


