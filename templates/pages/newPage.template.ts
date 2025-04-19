import { useComponent } from "@yajsb";

export function template () {
  return /*html*/`
<!DOCTYPE html>
${useComponent("htmlWithLang")}
<head>
${useComponent("head")}
</head>

<body>
</body>
</html>`;
}