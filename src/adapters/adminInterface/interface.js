const useHtmlEditor = [];

let   isActive      = false;
let   isVisible     = false;
let   usedEditor    = "";

const dom = {
  body          : document.querySelector("body"),
  btAdd         : document.getElementById("add"),
  btDeploy      : document.getElementById("deploy"),
  btPageSettings: document.getElementById("ps"),
  btShowHide    : document.getElementById("showHide"),
  mainSwitch    : document.getElementById("mainSwitch"),
  messages      : document.querySelector("messages"),
  modal         : document.querySelector("dialog"),
  modalClose    : document.getElementById("dialogClose"),
  modalContent  : document.querySelector("dialog > form"),
  modalTitle    : document.querySelector("dialog > h3"),
  modalSave     : document.getElementById("dialogSave"),
  panel         : document.querySelector("editor"),
};

window.onload = () => {
  // refreshPagesList();
  // getPage("/")
  // dom.list.onchange = changePage;
  // dom.save.onclick  = savePage;*

  dom.body.setAttribute('data-active', 'false');

  document.querySelectorAll('[data-editor]').forEach(element => {
    element.addEventListener('click', (e) => {
      if (!isActive) return;
      e.preventDefault();
      e.stopPropagation();
      const editorValue = element.getAttribute('data-editor');
      openModal(editorValue);
    });
  });

  updatePanelVisible( dom.messages !== null );

  dom.mainSwitch.onchange = function () { updateBodyActive(this.checked); };
  dom.btShowHide.onclick  = () => { updatePanelVisible(!isVisible); };
  dom.modalClose.onclick = closeModal;
  dom.modalSave.onclick  = saveNewData;
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
  isVisible = newState;
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
    // const ref= element+entryName;
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
    height: '700px',
    toolbar_sticky: true,
    icons: 'thin',
    autosave_restore_when_empty: true
  });
}

function saveNewData() {
  const {component, data, id} = extractData(usedEditor);
  const result = {
    component,
    data      : {},
    editorData: usedEditor,
    id,
    page: new URL(document.URL).pathname
  };
  for (const key of Object.keys(data)) {
    const value = data[key].element.startsWith("html")
      ? tinymce.get(key).getContent({ format: "text" })
      : document.querySelector("dialog #"+key).value;
    if (value !== "" && !data[key].element.endsWith('?')) result.data[key] = value;
  }

  console.log(result)

  //TODO envoyer requete pour envoyer les données
  closeModal();
}