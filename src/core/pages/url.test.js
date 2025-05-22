import { pageFolder, projectRoot } from "@core/constants";
import { extractFromUrl }          from './url';//adjusttheimportpathasnecessary

//TODO reprendre en ajoutant fileToWrite
/*
describe('extractFromUrl', () => {
  it('should extract correctly for /blog/my_super_article', async () => {
    const url          = '/blog/my_super_article';
    const result       = await extractFromUrl(url);
    const expectedPath = projectRoot+pageFolder;

    expect(result.templateToLoad).toBe(expectedPath+"/blog/blog.childs.template.ts");
    expect(result.dataToLoad).toBe(expectedPath+"/blog/my_super_article.json");
  });

  it('should extract correctly for /blog', async () => {
    const url          = '/blog';
    const result       = await extractFromUrl(url);
    const expectedPath = projectRoot+pageFolder;

    expect(result.templateToLoad).toBe(expectedPath+"/blog/blog.index.template.ts");
    expect(result.dataToLoad).toBe(expectedPath+"/blog/blog.index.json");
  });

  it('should extract correctly for /', async () => {
    const url          = '/';
    const result       = await extractFromUrl(url);
    const expectedPath = projectRoot+pageFolder;

    expect(result.templateToLoad).toBe(expectedPath+"/index.template.ts");
    expect(result.dataToLoad).toBe(expectedPath+"/index.json");
  });
});
*/