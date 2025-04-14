import {PageSettings} from "./components/pageSettings/pageSettings";
import {HtmlWithLang} from "./components/htmlWithLang/htmlWithLang";
import {Nav} from "./components/nav/nav";
import {Footer} from "./components/footer/footer";
import {Link} from "./components/link/link";
import {Head} from "./components/head/head";

export type PageData = {
pageSettings:PageSettings
htmlWithLang:HtmlWithLang
nav:Nav
footer:Footer
link:Link
head:Head

}

export type Component = "PageSettings" | "HtmlWithLang" | "Nav" | "Footer" | "Link" | "Head";