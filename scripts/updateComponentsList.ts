import { componentFolder, dataExtension, index, pageFolder, projectRoot, templateExtension, templateFolder, tsExtension } from "@core/constants";
import { createDirectory, getFolderContent, getFolderContentRecursive, readFileAsString, writeToFile }                    from "@adapters/files/files";
import { firstLetterLowerCase, firstLetterUppercase }                                                                     from "@core/utils";

export type ComponentData = "0" | "1" | "2" | "3" | "4"

switch (process.argv[2]) {
  case "add":
    await add(process.argv[3] as "page" | "component", process.argv[4], process.argv[5] as ComponentData);
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
    const upperName = firstLetterUppercase(componentName);
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

export async function add(type:"page"|"component", name:string, multiple:ComponentData) {

  function defineFolder(base:string):string {
    return base + (type === page
      ? pageFolder
      : componentFolder)+"/";
  }

  const component = "component"
  const page      = "page";
  const scss      = ".scss";

  if (type !== page && type !== component) throw new Error("Invalid type");
  if (name === "true" || name === "false" || name === undefined) throw new Error("Invalid name");
  if (multiple === undefined) throw new Error("Invalid multiple");

  console.log("Add", type, name, multiple);

        name              = firstLetterLowerCase(name);;
  const nameFU            = firstLetterUppercase(name);
  const folderDestination = defineFolder(projectRoot)+name+"/";

  const folderDestinationContent = await getFolderContent(defineFolder(projectRoot));
  if (folderDestinationContent.includes(name)) {
    console.log(`${type} ${name} already exists`);
    process.exit(0);
  }

  await createDirectory(folderDestination);

  const folderSrc = defineFolder(templateFolder);
  const filesSrc  = await getFolderContent(folderSrc);

  for (const file of filesSrc) {
    const rawContent = await readFileAsString(folderSrc + file);
    const target     = folderDestination + name;
    const content    = rawContent
      .replaceAll("§nameLower§", name)
      .replaceAll("§nameUpper§", nameFU);
    switch (true) {
      case file.endsWith(scss):
        writeToFile(target + scss, content);
        break;
      case file.endsWith(dataExtension):
        writeToFile(target + "."+ index + dataExtension, content);
        break;
      case file.endsWith(templateExtension):  // /!\ templateExtension should be before tsExtension
        writeToFile(target + "."+ index + templateExtension, content);
        multiple && writeToFile(target + ".childs" + templateExtension, content);
        break;
      case file.endsWith(tsExtension):
        if (type === component) {
          const multipleNb         = parseInt(multiple);
          const { schema, example} = getSchemaAndExample(multiple);

          writeToFile(target + tsExtension, content
            .replace("§multiple§",        multipleNb < 3 ? "true"  : "false")
            .replace("§importZod§",       multipleNb > 0 ? 'import { z } from "zod"' : "")
            .replace("§schemaExample§",   schema)
            .replace("§componentType§",   multipleNb > 0 ? "type "+nameFU+" = z.infer<typeof schema>;" : "")
            .replace("§componentArg§",    multipleNb     ? ", "+name : "")
            .replace("§templateExample§", example)
            .replaceAll("§name§", name)
          );
        }
        break;
      default:
        console.error("Unknown file", file);
    }
  }
  await makeContentFile();
}

/*
0 - no data
1 - 1 per page and only 1 editor
2 - 1 per page and multiple editors
3 - multiple per page and only 1 editor
4 - multiple per page and multiple editors
*/

function getSchemaAndExample(multiple: ComponentData) {
  const oneEditorTemplate = {
    schema: `z.object({
      title:   z.string(),
      content: z.string()
    })`,
    example: '<section class="§name§" data-editor="§name§"><h1>${§name§.title}</h1><p data-editor="content">${§name§.content}</p></section>'
  };
  const multipleEditorTemplate = {
    schema: /*js*/`z.object({
      myFirstEditor: z.object({
        title:   z.string().default("A title section"),
        content: z.string().default("Lorem Ipsum")
      }),
      linkEditor: z.object({
        url      : z.string().default("#"),
        text     : z.string().default("link to change"),
        ariaLabel: z.string().optional()
      })
    })`,
    example: '<section class="§name§">\n  <header data-editor="myFirstEditor">\n    <h1>${§name§.myFirstEditor.title}</h1>\n    <p data-editor="content">${§name§.myFirstEditor.content}</p>\n  </header>\n  <p><a href="${§name§.linkEditor.url}" aria-label="${§name§.linkEditor.ariaLabel}">${§name§.linkEditor.text}</a></p>\n</section>'
  };
  switch (parseInt(multiple)) {
    case 0:
      return {
        schema: "null",
        example: '<section class="§name§"></section>'
      };
    case 1:
    case 2:
      return oneEditorTemplate;
    case 3:
    case 4:
      return multipleEditorTemplate;
    default:
      throw new Error("Invalid multiple");
  }
}