import { add, type ComponentData } from "./updateComponentsList";

  // colors
const GREEN = '\x1b[32m';
const NC    = '\x1b[0m';   // No Color

  // Fonction pour poser une question avec un choix et une valeur par défaut
async function askChoice(prompt: string, defaultChoice: number): Promise<number> {
  console.log(`${GREEN}${prompt}${NC}`);
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
  console.log(`${GREEN}${prompt}${NC}`);
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

  // Fonction pour lire une saisie obligatoire
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

  // Fonction pour lire une entrée utilisateur
function readInput(prompt: string): Promise<string> {
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

  // Choix principal
async function main() {
  console.log(`${GREEN}What do you want to create?${NC}`);
  console.log("(1) Page");
  console.log("(2) Component");
  const mainChoice = await readInput("Select an option (default is 1): ");

  let type     : "component" | "page";
  let name     : string;
  let subOption: number;

  if (mainChoice === "" || mainChoice === "1") {
    type = "page";
    console.log("You chose: Page\n");

    console.log(`${GREEN}Enter the name of the page:${NC}`);
    name = await readNonEmpty("");

    console.log(`${GREEN}Now, let's check if this page will have subpages.${NC}`);
    subOption = await askChoice("Will there be subpages?", 1);

  } else if (mainChoice === "2") {
    type = "component";
    console.log("You chose: Component\n");

    console.log(`${GREEN}Enter the name of the component:${NC}`);
    name = await readNonEmpty("");

    console.log(`${GREEN}Now, let's check if this component will have multiple iterations on the same page.${NC}`);
    subOption = await askComponentData("How will be the component data ?");
  } else {
    console.log("Invalid option. Please run the script again and choose a number between 0 and 4.");
    process.exit(1);
  }
  await add(type, name, subOption.toString() as ComponentData);
  process.exit(0);
}

main();