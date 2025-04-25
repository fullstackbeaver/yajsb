import { createDirectory, getFolderContent, readFileAsString, writeToFile } from '../adapters/files/files';
import fs                                                  from 'fs';
import path                                                from 'path';


const adminInterface     = "adminInterface/";
const adminInterfacePath = "./src/adapters/";
const libFile            = "index.js";
const libPath            = "./lib/";

async function build() {

  const minified = process.argv.includes('--minify');
  try {
    // Étape 1: Supprimer l'ancien répertoire 'lib'
    if (fs.existsSync('./lib')) {
      fs.rmSync('./lib', { recursive: true, force: true });
      console.log('✅ Ancien répertoire lib supprimé');
    }

    // Étape 2: Générer les déclarations TypeScript
    console.log('📦 Génération des déclarations TypeScript...');
    const tscProcess = Bun.spawnSync([
      'bun',
      'tsc',
      '--emitDeclarationOnly',
      '--declaration',
      '--outDir',
      './lib'
    ]);

    if (tscProcess.exitCode !== 0) {
      console.error('❌ Échec de la génération des déclarations');
      process.exit(1);
    }

    // Étape 3: Nettoyer les sous-répertoires inutiles
    console.log('🧹 Nettoyage des exports inutiles...');
    if (fs.existsSync('./lib')) {
      const entries = fs.readdirSync('./lib', { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const dirPath = path.join('./lib', entry.name);
          fs.rmSync(dirPath, { recursive: true, force: true });
        }
      }
    }

    // Étape 4: Compiler l'application avec Bun
    console.log('🔨 Compilation du projet...');
    const buildProcess = Bun.spawnSync([
      'bun',
      'build',
      './src/index.ts',
      '--outdir',
      './lib',
      minified ? '--minify' : '--no-minify',
      '--target',
      'node',
      '--external', 'chokidar',
      '--external', 'jsdom',
      '--external', 'sass',
      '--external', 'zod',
      '--external', 'isomorphic-dompurify',
      '--verbose'
    ]);

    if (buildProcess.exitCode !== 0) {
      console.error('❌ Échec de la compilation');
      process.exit(1);
    }

    // Étape 5: changer le chemins de l'interface d'adminInterface
    console.log('🔧 Modification de l\'interface d\'administration...');
    const lib      = await readFileAsString(libPath+libFile);
    const landmark = 'server"';
    const newLib   = lib.split(minified ? "__dirname=" : "var __dirname")
    const start    = newLib[1].indexOf(landmark)+landmark.length;
    newLib[1]      = newLib[1].slice(start+(minified ? 1 : 2));
    await writeToFile(libPath+libFile, newLib.join(""));

    // Etape 6 : ajoute les fichiers de l'interface d'administration
    console.log('📦 Ajout des fichiers de l\'interface d\'administration...');
    const files = await getFolderContent(adminInterfacePath + adminInterface);
    await createDirectory(libPath + adminInterface);
    for (const file of files) {
      await writeToFile(libPath + adminInterface + file, await readFileAsString(adminInterfacePath + adminInterface + file));
    }

    console.log('✨ Build finalisé avec succès !');

  } catch (error) {
    console.error('🚨 Erreur critique:', error);
    process.exit(1);
  }
}

build();