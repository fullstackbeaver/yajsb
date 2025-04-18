import * as sass       from 'sass';
import { writeToFile } from '@adapters/files/files';

export async function makeCss(prod=false) {

  const options = {
    charset  : true,
    sourceMap: prod
  } as Record<string, string | Boolean>;

  if (prod) options.style = 'compressed';

  const saasResult = sass.compile(process.cwd() + '/site/css/style.scss', options);

  writeToFile("/style.css", saasResult.css.toString());
  console.log("css generated");
}

async function addComponentsStyle() {
  //TODO cherche les fichiers scss
  //TODO ajoutes les fichiers scss dans le fichier component.scss
  //TODO save file avec en tête qui explique que le fichier est généré automatiquement
}