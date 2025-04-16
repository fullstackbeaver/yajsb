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
${useComponent("hero")}
${useComponent("footer")}
</body>
</html>`;
}