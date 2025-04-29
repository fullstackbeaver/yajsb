const apiUrl = "/api/v1";
const dom    = {
  body: document.querySelector("body")
};
const useHtmlEditor = [];

let isActive   = false;
let isDeployed = false;
let usedEditor = "";

dom.body?.setAttribute('data-active', 'false');
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
  dom.editorAside  = document.querySelector("editor > aside");

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
  dom.modalTitle.innerText    = component+(id ? " #"+id : "");
  dom.modalContent.innerHTML  = Object.entries(data)
    .map((data) => addField(data, component))
    .join("");

  dom.modal.showModal();
  useHtmlEditor.forEach(ref => useTinyMce('#'+ref));
}

function closeModal() {
  dom.modal.close();
}

function updateBodyActive(newState) {
  dom.body?.setAttribute('data-active', newState);
  isActive = newState;
};

function updatePanelVisible(newState) {
  isDeployed = newState;
  dom.panel.setAttribute('data-visible', newState);
  // alert("updatePanelVisible " + newState + " " + dom.editorAside.getAttribute('display'));
  if (!newState) {
    dom.editorAside.hidden = true;
  }
};

function extractData(editorValue) {

  function getDataFromPageData() {
    if (editor && id )                            return pageData[component][id][editor];
    if (editor && id === undefined)               return pageData[component][editor];
    if (editor === undefined && id === undefined) return pageData[component];
    return pageData[component][id]; // editor is undefined && id is defined
  }

  let [component, editor, id] = editorValue.split(".");

  // validate that id and editor are not interverted
  if (id === undefined && editor !== undefined) {
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

function addField([entryName, { element, data }], component) {
  function fill() {
    switch (element) {
      case "string":
        return /*html*/`<input type="text" id="${entryName}" name="${element}" value="${data ? data : ""}">`;
      case "number":
        return /*html*/`<input type="number" id="${entryName}" name="${element}" value="${data ? data : ""}">`;
      case "boolean":
        return /*html*/`<input type="checkbox" id="${entryName}" name="${element}" value="${data ? data : ""}">`;
      case "html":
        useHtmlEditor.push(entryName);
        return /*html*/`<textarea id="${entryName}">${data}</textarea>`;
      case "enum":
        return /*html*/`<select name="${entryName}" id="${entryName}">
        ${editorData["_enum."+component][entryName].map((value) => `<option value="${value}"${data === value ? " selected" : ""}>${value}</option>`).join("")}
        </select>`;
      case "urlPicker":
        return /*html*/`<input type="url" id="${entryName}" name="${element}" value="${data ? data : ""}"><button id="selectUrl.${entryName}" onclick="selectUrl('${entryName}')">choose page</button><div id="urlPicker"></div>`;
      default:
        alert("unknown field type " + element);
        return "";
    }
  }

  const isOptional = element.endsWith('?');
  if (isOptional) element = element.slice(0, -1);
  return /*html*/`<article><label for="${entryName}">${entryName}${isOptional ? "" : "*"}</label>${fill()}</div>`;
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

function fillInterface() {
  dom.body.innerHTML +=/*html*/`
<editor ontransitionend="showAside()">
  <label class="toggle-switch">
    <input type="checkbox" id="mainSwitch" onchange="updateBodyActive(this.checked)"${isActive ? " checked" : ""}>
    <span class="slider"></span>
  </label>
  <button id="showHide" onclick="updatePanelVisible(!isDeployed)"><</button>
  <aside>
  ${listMessages()}
  <button id="ps" onclick="openModal('pageSettings')">Page Settings</button>
  <button id="head" onclick="openModal('head')">head</button>
  <button id="add">Add Page</button>
  <button id="deploy">deploy</button>
  </aside>
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
  if (messages.length === 0) return "";

  const listItems = messages.map(function(message) {
    return "<li>" + message + "</li>";
  }).join("\n");

  return "<messages><ul>" + listItems + "</ul></messages>";
}

async function selectUrl(target) {
  dom.buttonUrlPicker = document.getElementById("selectUrl."+target);
  dom.buttonUrlPicker.setAttribute("disabled", true);
  const pages             = await fetcherGet(apiUrl+"/siteTree");
  dom.urlPicker           = document.getElementById("urlPicker");
  dom.urlPicker.innerHTML = /*html*/`<select size="4" onchange="setUrl(this.value, '${target}')">
  ${pages.map(page => `<option value="${page}">${page}</option>`).join("")}
  </select>`;
}

function setUrl(url, target) {
  dom.buttonUrlPicker.removeAttribute("disabled");
  dom.urlPicker.innerText = "";
  document.getElementById(target).value = url;
}

function showAside(){
  if (isDeployed) dom.editorAside.hidden = false;
}