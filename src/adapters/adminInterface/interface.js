// import { changePage, getPage,refreshPagesList, savePage } from "./pageManager.js";

const dom = {
  site : document.querySelector("site"),
  panel : document.querySelector("panel"),
  // btnChgPage: document.getElementById("pageBtn"),
  // editor    : new FroalaEditor("#editor", {
  //   toolbarButtons: [
  //     [
  //       "align",
  //       "bold",
  //       "italic",
  //       "underline",
  //       "strikeThrough",
  //       "paragraphFormat",
  //     ],
  //     [
  //       "inlineClass",
  //       "inlineStyle",
  //       "clearFormatting"
  //     ],
  //     [
  //       "imageManager",
  //       "insertFiles",
  //     ],
  //     [
  //       "undo", "redo", "html", "save", "insertHorizontalRule", "uploadFile", "removeFormat", "fullscreen"
  //     ],
  //     ["insertHTML", "undo", "redo", "html"]
  //   ],

  //   charCounterCount              : true,
  //   toolbarInline                 : false,
  //   toolbarVisibleWithoutSelection: false,

  //   events: {
  //     contentChanged: function () {
  //       console.log("content changed");
  //     }
  //   }
  // }),
  // image          : editableComponent("image"),
  // list           : document.getElementById("pages"),
  // metaDescription: editableComponent("meta-description"),
  // pageType       : document.getElementById("pageType"),
  // save           : document.getElementById("save"),
  // title          : editableComponent("editor-title"),
};

window.onload = () => {
  // refreshPagesList();
  // getPage("/")
  console.log(listeners);
  // dom.list.onchange = changePage;
  // dom.save.onclick  = savePage;
}