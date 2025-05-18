// src/core/constants.ts
var componentFolder = "/components";
var dataExtension = ".json";
var generatedFileExtension = ".html";
var index = "index";
var localhost = "http://localhost";
var pageFolder = "/pages";
var sharedKey = "shared";
var tsExtension = ".ts";
var projectRoot = process.cwd() + "/site";
var sharedIndex = sharedKey + "_";
var templateFolder = process.cwd() + "/templates";
var templateExtension = ".template" + tsExtension;

// src/adapters/files/files.ts
import { mkdir, readdir } from "node:fs/promises";
import { join } from "path";
async function getFolderContent(path) {
  if (Array.isArray(path))
    path = join(...path);
  return await readdir(path);
}
function writeToFile(path, data) {
  return Bun.write(path, data);
}
function readJsonFile(path) {
  return Bun.file(path).json();
}
async function getFolderContentRecursive(path, folderName) {
  if (Array.isArray(path))
    path = join(...path);
  const files = await readdir(path, { withFileTypes: true });
  const current = {
    data: [],
    templates: [],
    styles: []
  };
  for (const file of files) {
    const fileName = file.name;
    if (file.isDirectory()) {
      const subfolder = await getFolderContentRecursive(join(path, fileName), fileName);
      if (current.folders == null)
        current.folders = {};
      current.folders[fileName] = subfolder[fileName];
      continue;
    }
    if (fileName.endsWith(templateExtension)) {
      current.templates.push(fileName.slice(0, -templateExtension.length));
      continue;
    }
    if (fileName.endsWith(dataExtension)) {
      current.data.push(fileName.slice(0, -dataExtension.length));
    }
    if (fileName.endsWith("scss")) {
      current.styles.push(fileName.slice(0, -dataExtension.length));
    }
  }
  const name = folderName ?? path.split(/[\\/]/).pop();
  return {
    [name]: current
  };
}
function writeJson(path, data) {
  writeToFile(path, JSON.stringify(data, null, 2));
}
async function readFileAsString(path) {
  return await Bun.file(path).text();
}
async function createDirectory(path) {
  await mkdir(path, { recursive: false });
}

// src/core/utils.ts
function firstLetterUppercase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function firstLetterLowerCase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

// node_modules/ls4bun/lib/index.js
import K from "isomorphic-dompurify";

// node_modules/ls4bun/src/utils/utils.ts
import DOMPurify from "isomorphic-dompurify";
function isString(value) {
  return typeof value === "string";
}
function sanitizeInput(input) {
  if (isString(input))
    return DOMPurify.sanitize(input);
  if (Array.isArray(input))
    return input.map((entry) => isString(entry) ? DOMPurify.sanitize(entry) : sanitizeInput(entry));
  if (typeof input === "object" && input !== null) {
    const sanitizedObject = {};
    for (const [key, value] of Object.entries(input)) {
      sanitizedObject[DOMPurify.sanitize(key)] = sanitizeInput(value);
    }
    return sanitizedObject;
  }
  return input;
}

// node_modules/ls4bun/lib/index.js
import B from "fs";
import x from "path";
var Z;
((V) => {
  V.DELETE = "DELETE";
  V.GET = "GET";
  V.OPTIONS = "OPTIONS";
  V.PATCH = "PATCH";
  V.POST = "POST";
  V.PUT = "PUT";
})(Z ||= {});
function Q(E) {
  return typeof E === "string";
}
function $(E) {
  if (Q(E))
    return K.sanitize(E);
  if (Array.isArray(E))
    return E.map((G) => Q(G) ? K.sanitize(G) : $(G));
  if (typeof E === "object" && E !== null) {
    let G = {};
    for (let [T, N] of Object.entries(E))
      G[K.sanitize(T)] = $(N);
    return G;
  }
  return E;
}
function A(E) {
  return K.sanitize(E);
}
function I(E, G = 200, T = new Headers) {
  if (G >= 300 && G < 400)
    return Response.redirect(E, G);
  let N = { headers: T, status: G };
  if (E === null)
    return new Response("", N);
  if (Q(E))
    return new Response(E, N);
  return Response.json(E, N);
}
var J = { after: [], before: [] };
var X;
async function H(E, G, T = I) {
  let N = j(E);
  J.before && await _(J.before, N);
  let U = await z(N, G);
  if (U.status)
    N.result.status = U.status;
  if (U.headers) {
    let Y = typeof U.headers.get === "function" ? U.headers.entries() : Object.entries(U.headers);
    for (let [V, C] of Y)
      N.result.headers.set(V, C);
  }
  return N.result.body = U.body ?? U, J.after && await _(J.after, N), T(N.result.body, N.result.status, N.result.headers);
}
function R({ after: E, before: G }) {
  if (G)
    J.before = G;
  if (E)
    J.after = E;
}
async function z(E, { handler: G, inputSchema: T, outputSchema: N }) {
  if (T && !X(T, E.body))
    throw new Error("400|wrong body data");
  let U = G.constructor.name === "AsyncFunction" ? await G(E) : G(E);
  if (N && !X(N, U))
    throw new Error("500|result is not as expected");
  return U;
}
function j(E) {
  return { body: O(E), context: {}, headers: E.headers, method: E.method, params: E.params, query: E.url.includes("?") ? new URLSearchParams(E.url.split("?")[1]) : null, result: { body: null, headers: new Headers }, url: E.url };
}
async function O(E) {
  if (E.method === "GET" || E.method === "DELETE" || E.method === "OPTIONS" || !E.body)
    return null;
  if (!E.json)
    throw new Error("400|Invalid body");
  try {
    let G = await E.json();
    return sanitizeInput(G);
  } catch (G) {
    throw new Error(`400|Invalid body
` + (G instanceof Error ? G.message : G));
  }
}
async function _(E, G) {
  for (let T of E)
    await T(G);
}
var { file: P } = globalThis.Bun;
function D(E, G) {
  return B.readdirSync(E).forEach((N) => {
    let U = x.join(E, N);
    if (B.statSync(U).isDirectory())
      G = D(U, G);
    else
      G.push(U);
  }), G;
}
function L(E) {
  try {
    let G = D(E, []), T = E.split("/").pop(), N = G[0].indexOf(T) + T.length;
    return { content: G.map((U) => U.slice(N)), start: G[0].slice(0, N) };
  } catch (G) {
    let T = "500|";
    if (!(G instanceof Error))
      G = new Error(T + G);
    else
      G.message = T + G.message;
    throw G;
  }
}
function w(E, G) {
  function T(C) {
    if (C.endsWith(N))
      C = C.replace(N, "");
    return G + C;
  }
  if (G ??= E, G.endsWith("/"))
    G = G.slice(0, -1);
  let N = "index.html", { content: U, start: Y } = L(E), V = {};
  for (let C of U)
    V[T(C)] = W(Y + C);
  return V;
}
function W(E) {
  return () => new Response(P(E));
}

// src/core/siteTree.ts
async function getFileTree(includeAddLocation, includeUnpublished, refs) {
  refs ??= await getGeneratedPaths(await getFolderContentRecursive(projectRoot + pageFolder), true);
  console.log("files", refs);
  return refs.filter((path) => {
    const lastElement = path.split("/").pop();
    if (!includeAddLocation && path.endsWith("+"))
      return false;
    if (!includeUnpublished && lastElement?.startsWith("_"))
      return false;
    return true;
  });
}
function getGeneratedPaths(folders, addLocation = false, currentPath = "") {
  const paths = [];
  for (const folderName in folders) {
    const folder = folders[folderName];
    const newPath = `${currentPath}/${folderName}`.replace(/\/+/g, "/");
    const hasIndexData = folder.data.includes(index) || folder.data.some((d) => d.endsWith(".index"));
    const hasIndexTemplate = folder.templates.includes(index) || folder.templates.some((t) => t.endsWith(".index"));
    const hasChildsTemplate = folder.templates.some((t) => t.endsWith("childs"));
    if (hasIndexData && hasIndexTemplate) {
      paths.push(newPath);
    }
    if (hasChildsTemplate) {
      if (addLocation) {
        paths.push(`${newPath}/+`);
      }
      for (const dataItem of folder.data) {
        if (!dataItem.endsWith("." + index) && dataItem !== index) {
          paths.push(`${newPath}/${dataItem}`);
        }
      }
    }
    if (folder.folders) {
      const subPaths = getGeneratedPaths(folder.folders, addLocation, newPath);
      paths.push(...subPaths);
    }
  }
  return paths.map((path) => path === pageFolder ? "/" : path.replace(pageFolder, ""));
}

// src/adapters/zod/zod.ts
import { z as z2, ZodDefault, ZodEnum, ZodOptional } from "zod";
function getDefaultData(schema) {
  const shape = schema._def.shape();
  const objectKeys = Object.keys(shape).filter((key) => {
    const field = shape[key];
    const unwrapped = field.unwrap?.() ?? field;
    return unwrapped instanceof z2.ZodObject;
  });
  return objectKeys.length === 0 ? schema.parse({}) : schema.parse(Object.fromEntries(new Map(objectKeys.map((key) => [key, {}]))));
}
function getSchemaKeys(schema) {
  const shape = schema._def.shape();
  const objectKeys = Object.keys(shape).filter((key) => {
    const field = shape[key];
    const unwrapped = field.unwrap?.() ?? field;
    return unwrapped instanceof z2.ZodObject;
  });
  return objectKeys.length === 0 ? extractSchemaDefinition(schema) : Object.fromEntries(new Map(objectKeys.map((key) => [key, extractSchemaDefinition(shape[key])])));
}
function extractSchemaDefinition(schema) {
  const shape = schema.shape;
  const result = {};
  for (const key in shape) {
    const field = shape[key];
    const isOptional = field instanceof ZodOptional;
    const wrapper = extractFromDescription(field._def.description, false);
    const typeName = getZodTypeName(field);
    let finalType;
    if (wrapper) {
      finalType = isOptional && !wrapper.endsWith("?") ? wrapper + "?" : wrapper;
    } else {
      finalType = isOptional ? typeName : typeName.replace(/\?$/, "");
    }
    result[key] = finalType;
  }
  return result;
}
function getZodTypeName(zodType) {
  if (zodType instanceof ZodOptional) {
    return getZodTypeName(zodType._def.innerType) + "?";
  }
  if (zodType instanceof ZodDefault) {
    return getZodTypeName(zodType._def.innerType);
  }
  const typeName = zodType._def.typeName;
  switch (typeName) {
    case "ZodString":
      return "string";
    case "ZodNumber":
      return "number";
    case "ZodBoolean":
      return "boolean";
    case "ZodDate":
      return "Date";
    case "ZodEnum":
      return "enum";
    default:
      return "unknown";
  }
}
function extractFromDescription(description, wantMessage) {
  if (!description)
    return;
  const { message, wrapper } = description.startsWith("{") ? JSON.parse(description) : { message: description, wrapper: null };
  if (wantMessage)
    return message;
  return wrapper;
}
function getEnumValues(schema) {
  const result = {};
  const shape = schema.shape;
  for (const key in shape) {
    let field = shape[key];
    while (field instanceof ZodOptional || field instanceof ZodDefault) {
      field = field._def.innerType;
    }
    if (field instanceof ZodEnum) {
      result[key] = field._def.values;
    }
  }
  return result;
}

// src/core/components/component.ts
import DOMPurify2 from "isomorphic-dompurify";
var components = {};
var singleComponents = [];
var useComponentCtx = {
  addPageData,
  components,
  dataFromPage: getComponentDataFromPageData,
  render,
  sendError: errorComponent
};
async function loadComponentsInformation() {
  if (Object.keys(components).length > 0)
    return;
  const path = projectRoot + componentFolder;
  const files = await getFolderContent(path);
  const filteredFiles = files.filter((file) => !file.endsWith(tsExtension));
  for (const file of filteredFiles) {
    components[file] = await createComponent(path, file);
  }
}
function useComponent(componentName, id, context = useComponentCtx) {
  const { addPageData: addPageData2, components: components2, dataFromPage, render, sendError } = context;
  const editorMode = isEditorMode();
  const { schema, template } = components2[componentName];
  let data = dataFromPage(componentName, id);
  if (schema === undefined && template === undefined)
    return sendError(`Component ${componentName} not found or has no schema or template`);
  if (schema === undefined && !hasData(data) && template.length > 0)
    return sendError(`Schema not found for component ${componentName}, and no data found${id !== undefined ? " for " + id : ""} in pageData`);
  data = schema !== null ? merge(getDefaultData(schema), data ?? {}) : data;
  if (schema !== null && hasData(data)) {
    const validation = schema.safeParse(data);
    if (!validation.success)
      return sendError("Error in " + componentName + (id !== undefined ? "." + id : "") + ": " + validation.error.message);
  }
  if (editorMode) {
    hasData(data) && addPageData2(componentName, id, data);
    if (schema !== null && schema !== undefined) {
      const simplifiedSchema = getSchemaKeys(schema);
      addEditorData(componentName, simplifiedSchema);
      ["enum", "enum?"].some((value) => Object.values(simplifiedSchema).includes(value)) && addEditorData("_enum." + componentName, getEnumValues(schema));
    }
  }
  return render({
    data,
    editorMode,
    pageSettings: getPageSettings(),
    template,
    component: componentName,
    id
  });
}
async function createComponent(path, componentName, SglCompCtx = singleComponents, extension = tsExtension) {
  const { description, isSingle, schema, template } = await import(`${path}/${componentName}/${componentName}${extension}`);
  isSingle === true && SglCompCtx.push(componentName);
  return { description, schema, template };
}
function render({ data, editorMode, pageSettings, component, id, template }) {
  const result = template({
    [component]: data,
    pageSettings
  });
  if (editorMode) {
    const dynamicPattern = new RegExp(`data-editor="${component}(.*?)"`, "g");
    const editorResult = id !== undefined ? result.replace(dynamicPattern, (_2, p1) => {
      return `data-editor="${component}${p1}.${id}"`;
    }) : result;
    return editorResult;
  }
  if (!result.includes("data-editor"))
    return result;
  const domFragment = DOMPurify2.sanitize(result, { RETURN_DOM_FRAGMENT: true });
  for (const element of Array.from(domFragment.querySelectorAll("[data-editor]"))) {
    element.setAttribute("data-editor", element.getAttribute("data-editor").replace(/-[^-]+$/, ""));
  }
  return DOMPurify2.sanitize(result);
}
function errorComponent(msg) {
  addMessage(msg);
  return "";
}
function describeComponent(description) {
  return JSON.stringify(description);
}
function hasData(data) {
  if (!data || data === undefined)
    return false;
  if (Object.keys(data).length > 0)
    return true;
  return false;
}
function getPageSettingsEditor() {
  return getSchemaKeys(components.pageSettings.schema);
}
function getComponentByName(name) {
  return components[name];
}

// src/core/pages/pageData.ts
async function loadSharedData() {
  return await readJsonFile(projectRoot + "/" + sharedKey + dataExtension);
}
async function loadPagesData(path) {
  return await readJsonFile(path);
}
async function formatDataToSave(dataToLoad, data, component, editorData, getCpn = getComponentByName) {
  const [_2, editor, id] = editorData.split(".");
  const isSharedData = editor && editor.startsWith(sharedIndex) ? true : false;
  const target = isSharedData ? projectRoot + "/" + sharedKey + dataExtension : dataToLoad;
  console.log("*****", getCpn(component));
  const schema = getCpn(component).schema;
  if (schema === null)
    throw new Error(`Component ${component} has no schema -> can't save data`);
  const dataAreValid = schema.safeParse(data);
  if (!dataAreValid.success)
    throw new Error(dataAreValid.error.message);
  const completedData = merge(getDefaultData(schema), data);
  console.log("completedData", completedData);
  return {
    target,
    dataToSave: merge(await readJsonFile(target), reformatComponentData(component, id, editor, completedData)),
    isSharedData
  };
}
function merge(obj1, obj2) {
  const result = { ...obj1 };
  for (const key of Object.keys(obj2)) {
    const value = obj2[key];
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const existing = result[key];
      result[key] = merge(typeof existing === "object" && existing !== null ? existing : {}, value);
    } else {
      result[key] = value;
    }
  }
  return result;
}
function reformatComponentData(component, id, editor, data) {
  if (editor === undefined && id === undefined)
    return { [component]: $(data) };
  return id === undefined ? { [component]: { [editor]: $(data) } } : { [component]: { [id]: { [editor]: $(data) } } };
}

// src/core/pages/page.ts
import { JSDOM } from "jsdom";

// src/core/pages/url.ts
import { join as join2 } from "path";
async function extractFromUrl(url) {
  const cleanUrl = new URL(localhost + url).pathname;
  const currentPath = [projectRoot, pageFolder];
  const urlAsArray = cleanUrl.split("/").slice(1).filter((part) => part !== "");
  let dataToLoad = urlAsArray[urlAsArray.length - 1];
  let templateToLoad = "";
  let fileToWrite = "";
  for (const urlPart of urlAsArray) {
    try {
      await getFolderContent([...currentPath, urlPart]);
      currentPath.push(urlPart);
    } catch (e) {
      templateToLoad = `${currentPath[currentPath.length - 1]}.childs`;
      dataToLoad = urlPart;
      break;
    }
  }
  const baseSrc = join2(...currentPath);
  if (!templateToLoad) {
    const lastEntry = urlAsArray[urlAsArray.length - 1];
    if (urlAsArray.length > 0 && dataToLoad === lastEntry) {
      templateToLoad += `${lastEntry}.`;
      dataToLoad = `${lastEntry}.${index}`;
      fileToWrite += lastEntry;
    } else {
      dataToLoad = index;
      fileToWrite = index + generatedFileExtension;
    }
    templateToLoad += index;
  }
  if (urlAsArray.length === 0) {
    dataToLoad = index;
    templateToLoad = index;
  }
  return {
    templateToLoad: join2(baseSrc, templateToLoad + templateExtension),
    dataToLoad: join2(baseSrc, dataToLoad + dataExtension),
    fileToWrite: (baseSrc.endsWith(fileToWrite) ? baseSrc + generatedFileExtension : join2(baseSrc, fileToWrite)).replace("/site" + pageFolder + "/", "/generated/")
  };
}

// src/core/pages/page.ts
var messages = [];
var editorData = {};
var isEditor = false;
var pageData = {};
var usedPageData = {};
async function renderPage(url, isEditor2) {
  messages.length = 0;
  await loadComponentsInformation();
  const { dataToLoad, templateToLoad } = await extractFromUrl(url);
  try {
    const { template } = await import(templateToLoad);
    pageData = merge(await loadPagesData(dataToLoad), await loadSharedData());
    return isEditor2 ? renderWithEditorInterface(template) : minifyRenderedContent(template());
  } catch (error) {
    console.log("Error", error);
  }
}
function minifyRenderedContent(str) {
  if (typeof str !== "string")
    return str;
  return str.replace(/\n+/g, " ").replace(/\s{2,}/g, " ").replace(/>\s+</g, "><").trim();
}
function renderWithEditorInterface(template) {
  isEditor = true;
  editorData = {
    pageSettings: getPageSettingsEditor()
  };
  usedPageData.pageSettings = pageData.pageSettings;
  const html = template();
  const scripts = `
  <script src="https://cdn.tiny.cloud/1/2twbfyfjocws7ln2yp1xbioznajuwpd2obek1kwsiev66noc/tinymce/7/tinymce.min.js" referrerpolicy="origin"></script>

  <script src="/_editor/interface.js" defer></script>
  <script>
    var editorData = ${JSON.stringify(editorData)}
    var pageData   = ${JSON.stringify(usedPageData)}
    var messages   = ${JSON.stringify(messages)}
  </script>
  <link href="/_editor/style.css" rel="stylesheet" />`;
  return html.replace(/<head>/, `<head>${scripts}`);
}
function addMessage(message) {
  messages.push(message);
}
function isEditorMode() {
  return isEditor;
}
function addEditorData(component, data) {
  editorData[component] = data;
}
function addPageData(component, id, data) {
  usedPageData[component] ??= {};
  if (id !== undefined)
    usedPageData[component][id] = data;
  else
    usedPageData[component] = data;
}
function getComponentDataFromPageData(componentName, id) {
  return id !== undefined ? pageData[componentName]?.[id] : pageData[componentName];
}
function getPageSettings() {
  return pageData.pageSettings;
}
async function partialPageUpdate({ component, data, editorData: editorData2, url }) {
  const { templateToLoad, dataToLoad } = await extractFromUrl(url);
  const { dataToSave, isSharedData, target } = await formatDataToSave(dataToLoad, data, component, editorData2);
  await writeJson(target, dataToSave);
  messages.length = 0;
  const dataShared = isSharedData ? dataToSave : await loadPagesData(target);
  const dataPage = isSharedData ? await loadPagesData(dataToLoad) : dataToSave;
  pageData = merge(dataPage, dataShared);
  const { template } = await import(templateToLoad);
  const page = await template();
  const pageDom = new JSDOM(page).window.document;
  return {
    content: minifyRenderedContent(pageDom.querySelector("body").innerHTML),
    pageData,
    messages
  };
}
async function renderAllPages() {
  const pageList = await getFileTree(false, false);
  for (const page of pageList) {
    const rendered = await renderPage(page, false);
    const { fileToWrite } = await extractFromUrl(page);
    writeToFile(fileToWrite, rendered);
    console.log(fileToWrite);
  }
}

// src/adapters/server/routesSite.ts
var routesSite = {
  ...w(projectRoot + "/public", "/"),
  ...w(__dirname + "/adminInterface", "/_editor")
};
async function handleRouteSite(req) {
  return await H(req, {
    handler: async (request) => {
      const url = new URL(request.url).pathname;
      const files = await getFileTree(false, false);
      if (!files.includes(url))
        throw new Error("404|page " + url + " not found");
      return {
        status: 200,
        body: await renderPage(A(url), true),
        headers: {
          "Content-Type": "text/html"
        }
      };
    }
  });
}

// src/adapters/server/routesAPI.ts
var base = "/api/v1";
var routesAPI = {
  [base + "/update-partial"]: {
    [Z.POST]: (req) => H(req, {
      handler: async (request) => {
        return {
          body: await partialPageUpdate(await request.body),
          status: 200
        };
      }
    })
  },
  [base + "/siteTree"]: (req) => H(req, {
    handler: async () => {
      return {
        body: await getFileTree(false, true),
        status: 200
      };
    }
  })
};

// src/adapters/server/server.ts
var server = {};
var serverSettings = {
  error(error) {
    const [status, msg] = error.message.includes("|") ? error.message.split("|") : ["500", error.message];
    console.error(error.message, { status, msg }, error.stack);
    return new Response(msg ?? error.message, {
      headers: {
        "Content-Type": "text/html"
      },
      status: parseInt(status)
    });
  },
  fetch: async (request) => {
    return await handleRouteSite(request);
  },
  websocket: {
    message() {
      server.publish("connection", "connected");
    }
  },
  port: 4001,
  routes: {
    ...routesAPI,
    ...routesSite
  }
};
function runServer() {
  server = Bun.serve(serverSettings);
}
R({
  after: [
    async (req) => {
      req.result.headers.set("Cache-Control", "no-cache");
    }
  ]
});

// src/adapters/watcher/watcher.constants.ts
var EVENT;
((EVENT2) => {
  EVENT2["CHANGE"] = "change";
})(EVENT ||= {});
var EXTENSIONS;
((EXTENSIONS2) => {
  EXTENSIONS2["SCSS"] = "scss";
})(EXTENSIONS ||= {});
var FOLDERS;
((FOLDERS2) => {
  FOLDERS2["COMPONENTS"] = "components";
  FOLDERS2["PAGES"] = "pages";
})(FOLDERS ||= {});

// src/scripts/makeCss.ts
import * as sass from "sass";
async function makeCss(prod = false) {
  const options = {
    charset: true,
    sourceMap: !prod,
    loadPaths: [projectRoot + "/css"]
  };
  if (prod)
    options.style = "compressed";
  const saasResult = await sass.compileAsync(projectRoot + "/css/style.scss", options);
  writeToFile(projectRoot + "/public/style.css", saasResult.css.toString());
  console.log("css generated");
}

// src/adapters/watcher/watcher.ts
import { watch } from "chokidar";
function useWatcher(pathsToWatch, extensions, folders, automationRules) {
  const watcher = watch(pathsToWatch, { persistent: true });
  function extractExtension(filePath) {
    for (const extension of extensions) {
      if (filePath.endsWith(extension))
        return extension;
    }
    return null;
  }
  function extractFolder(filePath) {
    for (const folder of folders) {
      if (filePath.includes(folder) && !filePath.endsWith(folder))
        return folder;
    }
    return null;
  }
  function extractExtensionOrFolder(event, filePath) {
    return extractExtension(filePath);
  }
  for (const event of Object.values(EVENT)) {
    watcher.on(event, (filePath) => {
      const extensionOrFolder = extractExtensionOrFolder(event, filePath);
      extensionOrFolder !== null && automationRules[event][extensionOrFolder]();
    });
  }
}

// src/adapters/watcher/watcherRules.ts
function runWatcher() {
  useWatcher([process.cwd() + "/site"], Object.values(EXTENSIONS), Object.values(FOLDERS), {
    ["change" /* CHANGE */]: {
      ["scss" /* SCSS */]: makeCss
    }
  });
}

// src/index.ts
function startYajsb() {
  runServer();
  runWatcher();
}
var utils = {
  createDirectory,
  firstLetterLowerCase,
  firstLetterUppercase,
  getFolderContent,
  getFolderContentRecursive,
  readFileAsString,
  writeToFile
};
var constants = {
  componentFolder,
  dataExtension,
  index,
  pageFolder,
  projectRoot,
  templateExtension,
  templateFolder,
  tsExtension
};
export {
  utils,
  useComponent,
  startYajsb,
  makeCss,
  describeComponent,
  constants,
  renderAllPages as buildSite
};
