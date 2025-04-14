import type { PageData }          from "@site";
import      { describeComponent } from "@core/components/component";
import      { z }                 from "zod";

export const description = "link description";

export const schema = z.object({
  ariaLabel: z.string().optional().describe(describeComponent({ wrapper : "imagePicker"})),
  text     : z.string().default("text"),
  url      : z.string().default("#").describe(describeComponent({ wrapper : "html", message : "jkljkljkjl"})),
});

export type Link = z.infer<typeof schema>

export function template({link}:PageData){
  const aria = link.ariaLabel ? ` aria-label=”${link.ariaLabel}”` : "";
  return /*html*/`<a data-editor="link" href="${link.url}"${aria}>${link.text}</a>`;
}