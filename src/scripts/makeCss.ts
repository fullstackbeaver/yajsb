import * as sass       from 'sass';
import { projectRoot } from '@core/constants';
import { writeToFile } from '@adapters/files/files';

/**
 * Compile the sass files in the /css folder and write the result to /public/style.css.
 * @param prod - If true, the style of the generated css will be compressed.
 *               If false, source maps will be included.
 *
 * @returns A promise that resolves when the generation is finished.
 */
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