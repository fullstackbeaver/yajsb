import {PageSettings} from "./components/pageSettings/pageSettings";
import {HtmlWithLang} from "./components/htmlWithLang/htmlWithLang";
import {Nav} from "./components/nav/nav";
import {Hero} from "./components/hero/hero";
import {Footer} from "./components/footer/footer";
import {Link} from "./components/link/link";
import {Head} from "./components/head/head";

export type PageData = {
pageSettings:PageSettings
htmlWithLang:HtmlWithLang
nav:Nav
hero:Hero
footer:Footer
link:Link
head:Head

}

export type Component = "PageSettings" | "HtmlWithLang" | "Nav" | "Hero" | "Footer" | "Link" | "Head";