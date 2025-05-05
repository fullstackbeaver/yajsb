import { constants, makeCss, utils } from "yajsb";

export type ComponentData = "0" | "1" | "2" | "3" | "4"

const GREEN    = '\x1b[32m';
const NO_COLOR = '\x1b[0m';

async function main(action: string | undefined = process.argv[2], type: string | undefined = process.argv[3], name: string | undefined = process.argv[4], multiple: string | undefined = process.argv[5]) {

  switch (action) {
    case "add":
      type === undefined
        ? await addWithQuestion()
        : await add(type as "page" | "component", name, multiple as ComponentData);
      break;
    case "types":
      await makeContentFile();
      break;
    case "scss":
      await updateScssComponentsList();
      await makeCss()
      break;
    case undefined:
      await findScript();
      break;
    default:
      console.error("Unknown argument passed:", action);
  }
  process.exit(0);
}

async function makeContentFile() {
  let   imports    = "";
  let   exports    = "";
  const components = await findFolders();

  for (const componentName of components) {
    const upperName = utils.firstLetterUppercase(componentName);
    imports += "import {"+upperName+"} from \"./components/"+componentName+"/"+componentName+"\";\n";
    exports += componentName + ":"+upperName+"\n";
  }

  utils.writeToFile(process.cwd() + "/site/type.d.ts",  `// do not change this file, auto generated
${imports}
export type PageData = {
${exports}
}
export type Component = "${components.join("\" | \"")}";`);

  console.log("File file-types.ts generated successfully!");
}

async function findFolders() {
  return await utils.getFolderContent(constants.projectRoot + constants.componentFolder) as string[];
}

export async function updateScssComponentsList() {
  const { components } = await utils.getFolderContentRecursive(constants.projectRoot + constants.componentFolder);
  const folders        = await findFolders();
  utils.writeToFile(constants.projectRoot + "/css/components.scss", folders
    .filter(folder => (components as any).folders[folder].styles.length > 0)
    .map(folder => `@use "../components/${folder}/${folder}";`)
    .join("\n")
  );

  console.log("Component.scss file successfully updated!");
}

export async function add(type:"page"|"component", name:string, multiple:ComponentData) {

  function defineFolder(base:string):string {
    return base + (type === page
      ? constants.pageFolder
      : constants.componentFolder)+"/";
  }

  const component = "component"
  const page      = "page";
  const scss      = ".scss";

  if (type !== page && type !== component) throw new Error("Invalid type");
  if (name === "true" || name === "false" || name === undefined) throw new Error("Invalid name");
  if (multiple === undefined) throw new Error("Invalid multiple");

  console.log("Add", type, name, multiple);

        name              = utils.firstLetterLowerCase(name);;
  const nameFU            = utils.firstLetterUppercase(name);
  const folderDestination = defineFolder(constants.projectRoot)+name+"/";

  const folderDestinationContent = await utils.getFolderContent(defineFolder(constants.projectRoot));
  if (folderDestinationContent.includes(name)) {
    console.log(`${type} ${name} already exists`);
    process.exit(0);
  }

  await utils.createDirectory(folderDestination);

  const folderSrc = defineFolder(constants.templateFolder);
  const filesSrc  = await utils.getFolderContent(folderSrc);

  for (const file of filesSrc) {
    const rawContent = await utils.readFileAsString(folderSrc + file);
    const target     = folderDestination + name;
    const content    = rawContent
      .replaceAll("§nameLower§", name)
      .replaceAll("§nameUpper§", nameFU);
    switch (true) {
      case file.endsWith(scss):
        utils.writeToFile(target + scss, content);
        break;
      case file.endsWith(constants.dataExtension):
        utils.writeToFile(target + "."+ constants.index + constants.dataExtension, content);
        break;
      case file.endsWith(constants.templateExtension):  // /!\ constants.templateExtension should be before constants.tsExtension
        utils.writeToFile(target + "."+ constants.index + constants.templateExtension, content);
        multiple && utils.writeToFile(target + ".childs" + constants.templateExtension, content);
        break;
      case file.endsWith(constants.tsExtension+"tpl"):
        const multipleNb         = parseInt(multiple);
        const { schema, example} = getSchemaAndExample(multiple);

        utils.writeToFile(target + constants.tsExtension, content
          .replace("§multiple§",        multipleNb < 3 ? "true"  : "false")
          .replace("§importZod§",       multipleNb > 0 ? 'import { z } from "zod"' : "")
          .replace("§schemaExample§",   schema)
          .replace("§componentType§",   multipleNb > 0 ? "export type "+nameFU+" = z.infer<typeof schema>;" : "")
          .replace("§componentArg§",    multipleNb     ? ", "+name : "")
          .replace("§templateExample§", example)
          .replaceAll("§name§", name)
        );
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
      title:   z.string().default("A title"),
      content: z.string().default("the content"),
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

async function findScript(): Promise<void> {
  console.clear();
  console.log(GREEN+"What do you want to do ?"+NO_COLOR);
  console.log("(1) add a component or a page");
  console.log("(2) refresh types");
  console.log("(3) refresh scss");

  const choice      = await readInput(`Select an option: `);
  const valueChoice = parseInt(choice);
  if (choice === "" || isNaN(valueChoice) || valueChoice < 1 || valueChoice > 3) return findScript();
  await main(["add","types","scss"][valueChoice-1]);
}

async function askChoice(prompt: string, defaultChoice: number): Promise<number> {
  console.log(`${GREEN}${prompt}${NO_COLOR}`);
  console.log("(1) Yes", defaultChoice === 1 ? "(default)" : "");
  console.log("(2) No", defaultChoice === 2 ? "(default)" : "");
  const choice = await readInput("Select an option");

  if (choice === "") {
    return defaultChoice;
  } else if (choice === "1") {
    return 1;
  } else if (choice === "2") {
    return 2;
  } else {
    console.log(`Invalid choice, defaulting to ${defaultChoice}`);
    return defaultChoice;
  }
}

async function askComponentData(prompt: string, defaultChoice: number = 1): Promise<number> {
  console.log(`${GREEN}${prompt}${NO_COLOR}`);
  console.log("(0) No data",                                defaultChoice === 0 ? "(default)" : "");
  console.log("(1) 1 per page and only 1 editor",           defaultChoice === 1 ? "(default)" : "");
  console.log("(2) 1 per page and multiple editors",        defaultChoice === 2 ? "(default)" : "");
  console.log("(3) Multiple per page and only 1 editor",    defaultChoice === 3 ? "(default)" : "");
  console.log("(4) Multiple per page and multiple editors", defaultChoice === 4 ? "(default)" : "");

  const choice = await readInput(`Select an option: `);

  const validChoices = {
    "0": "No data",
    "1": "1 per page and only 1 editor",
    "2": "1 per page and multiple editors",
    "3": "Multiple per page and only 1 editor",
    "4": "Multiple per page and multiple editors"
  };

  if (choice === "") {
    return defaultChoice;
  }
  const choiceInt = parseInt(choice);
  if (choiceInt >=0 && choiceInt <= 4) return choiceInt;

  console.log(`Invalid choice, defaulting to ${(validChoices as any)[defaultChoice.toString()]}`);
  return  defaultChoice;
}

async function readNonEmpty(prompt: string): Promise<string> {
  let input = "";
  while (input.trim() === "") {
    input = await readInput(`> `);
    if (input.trim() === "") {
      console.log("Name cannot be empty. Please enter a valid name.");
    }
  }
  return input;
}

export function readInput(prompt: string): Promise<string> {
  const stdin  = process.stdin;
  const stdout = process.stdout;

  stdout.write(prompt);

  return new Promise((resolve) => {
    stdin.resume();
    stdin.once('data', (data) => {
      resolve(data.toString().trim());
    });
  });
}

export async function addWithQuestion() {
  console.log(`${GREEN}What do you want to create?${NO_COLOR}`);
  console.log("(1) Page");
  console.log("(2) Component");
  const mainChoice = await readInput("Select an option (default is 1): ");

  let type     : "component" | "page";
  let name     : string;
  let subOption: number;

  if (mainChoice === "" || mainChoice === "1") {
    type = "page";
    console.log("You chose: Page\n");

    console.log(`${GREEN}Enter the name of the page:${NO_COLOR}`);
    name = await readNonEmpty("");

    console.log(`${GREEN}Now, let's check if this page will have subpages.${NO_COLOR}`);
    subOption = await askChoice("Will there be subpages?", 1);

  } else if (mainChoice === "2") {
    type = "component";
    console.log("You chose: Component\n");

    console.log(`${GREEN}Enter the name of the component:${NO_COLOR}`);
    name = await readNonEmpty("");

    console.log(`${GREEN}Now, let's check if this component will have multiple iterations on the same page.${NO_COLOR}`);
    subOption = await askComponentData("How will be the component data ?");
  } else {
    console.log("Invalid option. Please run the script again and choose a number between 0 and 4.");
    process.exit(1);
  }
  await add(type, name, subOption.toString() as ComponentData);
  process.exit(0);
}

main();