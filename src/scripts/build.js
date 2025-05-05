import { createDirectory, getFolderContent, readFileAsString, writeToFile } from '../adapters/files/files';
import fs                                                                   from 'fs';
import path                                                                 from 'path';

const GREEN              = '\x1b[32m';
const NO_COLOR           = '\x1b[0m';
const adminInterface     = "adminInterface/";
const adminInterfacePath = "./src/adapters/";
const libFile            = "index.js";
const libPath            = "./lib";

async function runCommand(cmd, msg) {
  try {
    console.log(msg);
    console.log(cmd);
    const bunProcess = Bun.spawn(cmd.split(' '), {
      stdout: 'pipe',
      stderr: 'pipe',
    });

    const stdout = bunProcess.stdout ? await new Response(bunProcess.stdout).text() : '';
    const stderr = bunProcess.stderr ? await new Response(bunProcess.stderr).text() : '';

    const exitCode = await bunProcess.exited;
    if (exitCode !== 0) {
      console.error(`❌ Command failed: ${cmd}`);
      console.error(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      process.exit(1);
    } else {
      console.log(`${GREEN}✔ Command succeeded: ${cmd}${NO_COLOR}`);
      if (stdout.trim()) console.log(stdout.trim());
      if (stderr.trim()) console.log(stderr.trim());
    }
  } catch (error) {
    console.error('🚨 Erreur critique:', error);
    process.exit(1);
  }
}

function copy(){

}

async function build() {

  const minified = process.argv.includes('--minify');
  try {
    // Étape 1: Supprimer l'ancien répertoire 'lib'
    if (fs.existsSync(libPath)) {
      fs.rmSync(libPath, { recursive: true, force: true });
      console.log('✅ Ancien répertoire lib supprimé');
    }

    // Étape 2: Générer les déclarations TypeScript
    await runCommand(
      'bun tsc --emitDeclarationOnly --declaration --outDir ./lib',
      "📦 Génération des déclarations TypeScript..."
    );

    // Étape 3: Nettoyer les sous-répertoires inutiles
    console.log('🧹 Nettoyage des exports inutiles...');
    if (fs.existsSync(libPath)) {
      const entries = fs.readdirSync(libPath, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const dirPath = path.join(libPath, entry.name);
          fs.rmSync(dirPath, { recursive: true, force: true });
        }
      }
    }

    // Étape 4: Compiler l'application avec Bun
    await runCommand(
      `bun build ./src/index.ts --outdir ./lib ${minified ? "--minify" : "--no-minify"} --target node --external chokidar --external jsdom --external sass --external zod --external isomorphic-dompurify --verbose`,
      "🔨 Compilation du projet..."
    );

    // Étape 5: changer le chemins de l'interface d'adminInterface
    console.log('🔧 Modification de l\'interface d\'administration...');
    const lib      = await readFileAsString(libPath+"/"+libFile);
    const landmark = 'server"';
    const newLib   = lib.split(minified ? "__dirname=" : "var __dirname")
    const start    = newLib[1].indexOf(landmark)+landmark.length;
    newLib[1]      = newLib[1].slice(start+(minified ? 1 : 2));
    await writeToFile(libPath+"/"+libFile, newLib.join(""));

    // Etape 6 : ajoute les fichiers de l'interface d'administration
    console.log('📦 Ajout des fichiers de l\'interface d\'administration...');
    const files = await getFolderContent(adminInterfacePath + adminInterface);
    await createDirectory(libPath+"/" + adminInterface);
    for (const file of files) {
      await writeToFile(libPath+"/" + adminInterface + file, await readFileAsString(adminInterfacePath + adminInterface + file));
    }

    // Etape 7 : ajoute les fichiers de scripts
    await runCommand(
      `cp ./src/scripts/scripts.ts ${libPath}/scripts.ts`,
      "📦 Ajout de scripts.ts..."
    );
    await runCommand(
      `cp -r ./templates ${libPath}/templates`,
      "📦 Ajout des templates..."
    );

    console.log('✨ Build finalisé avec succès !');

  } catch (error) {
    console.error('🚨 Erreur critique:', error);
    process.exit(1);
  }
}

build();