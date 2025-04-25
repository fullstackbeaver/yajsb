import * as sass       from 'sass';
import { projectRoot } from '@core/constants';
import { writeToFile } from '@adapters/files/files';



export async function makeCss(prod=false) {

  const options = {
    charset  : true,
    sourceMap: !prod,
    loadPaths: [projectRoot + "/css"],
  } as Record<string, string | string[] | boolean>;

  if (prod) options.style = 'compressed';

  const saasResult = await sass.compileAsync(projectRoot+'/css/style.scss', options);

  writeToFile(projectRoot + "/public/style.css", saasResult.css.toString());
  console.log("css generated");
}