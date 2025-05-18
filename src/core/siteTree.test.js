import { getFileTree, getGeneratedPaths } from "./siteTree";

const folderData = {
  pages: {
    data: ["index"],
    templates: ["index"],
    styles: [],
    folders: {
      "mentions-legales": {
        data: ["mentions-legales.index"],
        templates: ["mentions-legales.index"],
        styles: [],
      },
      blog: {
        data: ["blog.index", "article1", "_article2"],
        templates: ["blog.index", "blog.childs"],
        styles: [],
      },
    },
  }
};

describe("getFileTree", () => {
  const ref = ["/", "/blog", "/blog/+", "/blog/article1", "/blog/_article2"];
  it("should return an array of site tree with add location but without unpublished pages", async () => {
    const result = await getFileTree(true, false, ref);
    expect(result).toEqual(["/", "/blog", "/blog/+", "/blog/article1"]);
  });
  it("should return an array of site tree without add location and without unpublished pages", async () => {
    const result = await getFileTree(false, false, ref);
    expect(result).toEqual(["/", "/blog", "/blog/article1"]);
  });
  it("should return an array of site tree without add location but with unpublished pages", async () => {
    const result = await getFileTree(false, true, ref);
    expect(result).toEqual(["/", "/blog", "/blog/article1", "/blog/_article2"]);
  });
  it("should return an array of site tree without add location and unpublished pages", async () => {
    const result = await getFileTree(true, true, ref);
    expect(result).toEqual(ref);
  });
});

describe("getGeneratedPaths", () => {
  it("should return an array of site tree", async () => {
    const result = getGeneratedPaths(folderData, true);
    expect(result).toEqual(["/", "/mentions-legales", "/blog", "/blog/+", "/blog/article1", "/blog/_article2"]);
  });
})