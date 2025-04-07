import { fetchSavePage, loadPage } from "./fetcher.js";
import { dom }                     from "./interface.js";
import { getListOfPages }          from "./dataManager.js";
import { getDate } from "./date.js";

const addPage = "+ ajoute page";
let pageCreation = 0;

export async function refreshPagesList() {
  dom.list.innerHTML = "loading pages...";
  const pages        = await getListOfPages();
  // console.log(JSON.stringify(pages, null, 2));

  dom.list.innerHTML = "";
  dom.list.appendChild(optionChangePage(""));
  for (const page of pages) {
    dom.list.appendChild(optionChangePage(page));
  }

  dom.list.appendChild(optionChangePage(addPage));
}


export async function changePage() {
  switch (dom.list.value) {
    case addPage:
      alert("todo : add page");
      return;
    case "":
      return;
    default:
      injectInPage(await loadPage(dom.list.value));
      break;
  }
}

function optionChangePage(pageUrl){
  const newBtn       = document.createElement("option");
  newBtn.value       = pageUrl;
  newBtn.textContent = pageUrl;
  return newBtn;
}

function injectInPage(data){
  dom.editor.html.set(data.content);
  dom.image.update(data.image);
  dom.metaDescription.update(data.metaDescription);
  dom.pageType.value = data.pageType || "website";  //TODO use enum
  dom.title.update(data.title);
  pageCreation = data.dateCrea;
}

export async function savePage(){
  const result = await fetchSavePage({
    content        : dom.editor.html.get(),
    dateCrea       : pageCreation,
    dateModif      : getDate(),
    image          : dom.image.value,
    metaDescription: dom.metaDescription.value,
    pageType       : dom.pageType.value,
    title          : dom.title.value,
    url            : dom.list.value
  });
}

export async function getPageFromServer(url){
  injectInPage(await loadPage(dom.list.value));
}