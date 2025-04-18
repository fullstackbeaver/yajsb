import { add } from "./updateComponentsList";

  // colors
const GREEN = '\x1b[32m';
const NC    = '\x1b[0m';   // No Color

  // Fonction pour poser une question avec un choix et une valeur par défaut
async function askChoice(prompt: string, defaultChoice: string): Promise<string> {
  console.log(`${GREEN}${prompt}${NC}`);
  console.log("(1) Yes");
  console.log("(2) No");
  const choice = await readInput(`Select an option (default is ${defaultChoice}): `);

  if (choice === "") {
    return defaultChoice;
  } else if (choice === "1") {
    return "Yes";
  } else if (choice === "2") {
    return "No";
  } else {
    console.log(`Invalid choice, defaulting to ${defaultChoice}`);
    return defaultChoice;
  }
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
  let subOption: boolean;

  if (mainChoice === "" || mainChoice === "1") {
    type = "page";
    console.log("You chose: Page\n");

      // Demander le nom de la page
    console.log(`${GREEN}Enter the name of the page:${NC}`);
    name = await readNonEmpty("");

      // Demander s'il y a des sous-pages
    console.log(`${GREEN}Now, let's check if this page will have subpages.${NC}`);
    const subChoice = await askChoice("Will there be subpages?", "Yes");
          subOption = subChoice === "Yes";

  } else if (mainChoice === "2") {
    type = "component";
    console.log("You chose: Component\n");

      // Demander le nom du composant
    console.log(`${GREEN}Enter the name of the component:${NC}`);
    name = await readNonEmpty("");

      // Demander s'il y a plusieurs itérations du composant
    console.log(`${GREEN}Now, let's check if this component will have multiple iterations on the same page.${NC}`);
    const iterChoice = await askChoice("Will there be multiple iterations of this component on the same page?", "Yes");
          subOption  = iterChoice === "Yes";

  } else {
    console.log("Invalid option. Please run the script again and choose 1 or 2.");
    process.exit(1);
  }
  await add(type, name, subOption);
  process.exit(0);
}

main();
