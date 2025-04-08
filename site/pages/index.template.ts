import { useComponent } from "@core/page";


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