let isActive  = false;
let isVisible = false;

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
  panel         : document.querySelector("editor"),
};

window.onload = () => {
  // refreshPagesList();
  // getPage("/")
  // console.log({editorData, pageData});
  // dom.list.onchange = changePage;
  // dom.save.onclick  = savePage;*

  console.log({pageData, editorData});

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
  dom.modalClose.onclick = closeModale;
}

async function openModal(editorValue) {

  const {component, data, id} = extractData(editorValue);
  dom.modalTitle.innerText = component;
  console.log(editorValue, {component, id, data})

  dom.modalContent.innerHTML = Object.entries(data)
    .map(addField)
    .join("");

  dom.modal.showModal();
}

function closeModale() {
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
    console.log(component, editor)
  }

  const merged = {};
  const data= getDataFromPageData();
  const elements = editor
    ? editorData[component][editor]
    : editorData[component];

  console.log(elements, data)

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
    const ref= element+entryName;
    switch (element) {
      case "string":
        return /*html*/`<label for="${ref}">${entryName}${isOptional ? "" : "*"}</label><input type="text" id="${ref}" name="${element}" value="${data ? data : ""}">`;
      case "number":
        return /*html*/`<label for="${ref}">${entryName}${isOptional ? "" : "*"}</label><input type="number" id="${ref}" name="${element}" value="${data ? data : ""}">`;
      case "boolean":
        return /*html*/`<label for="${ref}">${entryName}${isOptional ? "" : "*"}</label><input type="checkbox" id="${ref}" name="${element}" value="${data ? data : ""}">`;
      case "html":
        return /*html*/`${entryName}${isOptional ? "" : "*"}<tinymce-editor id="${ref}" api-key="2twbfyfjocws7ln2yp1xbioznajuwpd2obek1kwsiev66noc">${data}</tinymce-editor>`;
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
}