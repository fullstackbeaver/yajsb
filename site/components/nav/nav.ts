import { z } from "zod";

import type { PageData } from "@site";

export const description = "nav description";

const linkSchema = z.object({
  url: z.string()
    .default("#")
    .describe("Description pour url"),
  text: z.string()
    .default("link to change")
    .describe("Description pour text"),
  ariaLabel: z.string()
    .default("what this link does")
    .describe("Description pour ariaLabel")
});

export const schema = z.object({
  l1: linkSchema,
  l2: linkSchema,
});

export type Nav = z.infer<typeof schema>

export function template({nav}:PageData){
  return /*html*/`
<nav>
  <ul>
    <li><a data-editor="nav.l1" href="${nav.l1.url}" aria-label="${nav.l1.ariaLabel}">${nav.l1.text}</a></li>
    <li><a data-editor="nav.l2" href="${nav.l2.url}" aria-label="${nav.l2.ariaLabel}">${nav.l2.text}</a></li>
  </ul>
</nav>
`;
}