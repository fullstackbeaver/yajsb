import { useComponent } from "@yajsb";

export const description = "footer description";
export const isSingle    = true;
export const schema      = null;


export function template(){
  return /*html*/`
<footer>
  ${useComponent("link", "shared_link1")}
  <p>&copy; 2025 demo</p>
</footer>
`;
}