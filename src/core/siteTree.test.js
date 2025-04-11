import { getFileTree } from "./siteTree";

describe("getFileTree", () => {
  const ref = ["/", "/blog", "/blog/+", "/blog/article1", "/blog/_article2"];
  it("should return an array of site tree with add location but without unpublished pages", async () => {
    const result = getFileTree(true, true, ref);
    expect(result).toEqual(["/", "/blog", "/blog/+", "/blog/article1"]);
  });
  it("should return an array of site tree without add location and without unpublished pages", async () => {
    const result = getFileTree(false, true, ref);
    expect(result).toEqual(["/", "/blog", "/blog/article1"]);
  });
  it("should return an array of site tree without add location but with unpublished pages", async () => {
    const result = getFileTree(false, false, ref);
    expect(result).toEqual(["/", "/blog", "/blog/article1", "/blog/_article2"]);
  });
  it("should return an array of site tree without add location and unpublished pages", async () => {
    const result = getFileTree(true, false, ref);
    expect(result).toEqual(ref);
  });
});