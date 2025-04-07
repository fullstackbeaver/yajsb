import type { Header } from "@components/header/header";
import type { Global } from "@coreComponents/global/global.types";

import type {Component} from "@components/type";
import { useComponent } from "@core/page";


type templateData = {
  Global: Global
  Header: {
    header:Header
  }
}


export function template () {
  return /*html*/`
  <!DOCTYPE html>
${useComponent("htmlWithLang", "pageHeader")}


<head>
  ${useComponent("header", "pageHeader")}
</head>

<body>

</body>
</html>
  `;
}