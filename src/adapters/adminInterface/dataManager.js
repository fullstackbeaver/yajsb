import { getPagesList, loadPage } from "./fetcher.js";

function generatePaths(obj, prefix = "") {
  let paths = [];

  if (typeof obj === "object" && obj !== null) {
    if (Array.isArray(obj)) {
      obj.forEach((item) => {
        paths = paths.concat(generatePaths(item, prefix));
      });
    } else {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          let newPrefix = prefix ? `${prefix}/${key}` : `/${key}`;
          paths = paths.concat(generatePaths(obj[key], newPrefix));
        }
      }
    }
  } else {
    paths.push(`${prefix}/${obj}`);
  }

  return paths;
}


export async function getListOfPages() {
  const pages = await getPagesList();
  return generatePaths(pages);
}

function encodeHtmlForJson(htmlContent){
  return htmlContent.replace(/"/g, '\\"');
}

// export async function getPageContent(url){
//   const data = await loadPage(url);
//   data.con

// }