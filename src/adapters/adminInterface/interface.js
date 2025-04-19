const apiUrl        = "/api/v1";
const dom           = {
  body: document.querySelector("body")
};
const useHtmlEditor = [];

let isActive      = false;
let isTransparent = false;
let usedEditor    = "";

dom.body.setAttribute('data-active', 'false');
window.onload = () => { createInterface() }

function createInterface(step=0){
  if (step === 0) fillInterface();
  if (step === 1) findElementsInDom();
  if (step === 2) return;
  setTimeout(()=> createInterface(step+1), 100);
}
function findElementsInDom(){
  dom.modal        = document.querySelector("dialog");
  dom.modalContent = document.querySelector("dialog > form");
  dom.modalTitle   = document.querySelector("dialog > h3");
  dom.panel        = document.querySelector("editor");

  document.querySelectorAll('[data-editor]').forEach(element => {
    element.addEventListener('click', (e) => {
      if (!isActive) return;
      e.preventDefault();
      e.stopPropagation();
      const editorValue = element.getAttribute('data-editor');
      openModal(editorValue);
    });
  });

  updatePanelVisible( messages.length> 0 );
}

async function openModal(editorValue) {

  const {component, data, id} = extractData(editorValue);
  usedEditor                  = editorValue;
  useHtmlEditor.length        = 0;
  dom.modalTitle.innerText    = component;
  dom.modalContent.innerHTML  = Object.entries(data)
    .map(addField)
    .join("");

  dom.modal.showModal();
  useHtmlEditor.forEach(ref => useTinyMce('#'+ref));
}

function closeModal() {
  dom.modal.close();
}

function updateBodyActive(newState) {
  dom.body.setAttribute('data-active', newState);
  isActive = newState;
};

function updatePanelVisible(newState) {
  isTransparent = newState;
  dom.panel.setAttribute('data-visible', newState);
};

function extractData(editorValue) {

  function getDataFromPageData() {
    if (editor && id )                            return pageData[component][id][editor];
    if (editor && id === undefined)               return pageData[component][editor];
    if (editor === undefined && id === undefined) return pageData[component];
    alert("unexpected use case for extracting data");
  }

  let [component, editor, id] = editorValue.split(".");

  // validate that id and editor are not interverted
  if (id === undefined){
    if (editorData[component][editor] === undefined) {
      id = editor;
      editor = undefined;
    }
  }

  const data     = getDataFromPageData();
  const elements = editor
    ? editorData[component][editor]
    : editorData[component];
  const merged   = {};

  const merging = new Set([
    ...Object.keys(elements || {}),
    ...Object.keys(data || {})
  ]);

  merging.forEach(cle => {
    merged[cle] = {
      element: elements?.[cle] ?? null,
      data: data?.[cle]        ?? undefined
    };
  });

  return {
    component,
    data: merged,
    id
  };
}

function addField([entryName, { element, data }]) {
  function fill() {
    //TODO add enum, number
    switch (element) {
      case "string":
        return /*html*/`<label for="${entryName}">${entryName}${isOptional ? "" : "*"}</label><input type="text" id="${entryName}" name="${element}" value="${data ? data : ""}">`;
      case "number":
        return /*html*/`<label for="${entryName}">${entryName}${isOptional ? "" : "*"}</label><input type="number" id="${entryName}" name="${element}" value="${data ? data : ""}">`;
      case "boolean":
        return /*html*/`<label for="${entryName}">${entryName}${isOptional ? "" : "*"}</label><input type="checkbox" id="${entryName}" name="${element}" value="${data ? data : ""}">`;
      case "html":
        useHtmlEditor.push(entryName);
        return /*html*/`${entryName}${isOptional ? "" : "*"}<textarea id="${entryName}">${data}</textarea>`;
      case "enum":
        alert("coder la prise en charge de l'enum");
        return "coder la prise en charge de l'enum";
      default:
        alert("unknown field type " + element);
        return "";
    }
  }

  const isOptional = element.endsWith('?');
  if (isOptional) element = element.slice(0, -1);
  return /*html*/`<article>${fill()}</div>`;
};

function useTinyMce(selector) {
  tinymce.init({
    selector,
    height                     : '700px',
    toolbar_sticky             : true,
    icons                      : 'thin',
    autosave_restore_when_empty: true
  });
}

async function saveNewData() {
  //TODO ajouter un système de chargement
  const {component, data, id} = extractData(usedEditor);
  const result = {
    component,
    data      : {},
    editorData: usedEditor,
    id,
    url: new URL(document.URL).pathname
  };
  for (const key of Object.keys(data)) {
    const value = data[key].element.startsWith("html")
      ? tinymce.get(key).getContent({ format: "text" })
      : document.querySelector("dialog #"+key).value;
    if (value !== "" && !data[key].element.endsWith('?')) result.data[key] = value;
  }

  dom.modal.innerHTML = "saving...";

  const newData = await fetcherPost("/update-partial", result);

  dom.body.innerHTML = newData.content;
  pageData           = newData.pageData;
  messages           = newData.messages;
  setTimeout(createInterface, 100);
}

async function fetcherGet(url) {
  const rawdata = await fetch(url);
  return await rawdata.json();
}

async function fetcherPost(url, data) {

  const rawdata = await fetch(apiUrl+url, {
    method: 'POST',
    headers: {
      'Accept'      : 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!rawdata.ok) throw new Error(rawdata.statusText);

  return await rawdata.json();
}

async function getPagesList() {
  return await fetcherGet(apiUrl+"getPages");
}

function fillInterface() {
  dom.body.innerHTML +=/*html*/`
<editor>
  <h1>Yajsb Editor</h1>
  <label class="toggle-switch">
    <input type="checkbox" id="mainSwitch" onchange="updateBodyActive(this.checked)"${isActive ? " checked" : ""}>
    <span class="slider"></span>
  </label>
  <button id="showHide" onclick="updatePanelVisible(!isTransparent)">hide</button>

  ${listMessages()}
  <button id="ps">Page Settings</button>
  <button id="add">Add Page</button>
  <button id="deploy">deploy</button>
</editor>
<dialog>
  <h3></h3>
  <button id="dialogClose" onclick="closeModal()">X</button>
  <form method="dialog"></form>
  <button autofocus type="reset" onclick="this.closest('dialog').close('cancel')">Cancel</button>
  <button id="dialogSave" onclick="saveNewData()">Save</button>
</dialog>
  `;
}

function listMessages() {
  return messages.length === 0
    ? ""
    : `<messages><ul>${messages.map((message) => `<li>${message}</li>`).join("\n")}</ul></messages>`;
}