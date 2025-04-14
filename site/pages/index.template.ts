import { useComponent } from "@yajsb";


export function template () {
  return /*html*/`
<!DOCTYPE html>
${useComponent("htmlWithLang")}
<head>
${useComponent("head")}
</head>

<body>
${useComponent("nav", "mainNav")}
<h1>ceci est un test</h1>
${useComponent("footer")}
</body>
</html>`;
}