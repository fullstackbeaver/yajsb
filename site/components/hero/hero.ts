import type { PageData }          from "@site";
import      { describeComponent } from "@core/components/component";
import      { z }                 from "zod";

export const isSingle = true;
export const schema   = z.object({
  content         : z.string().default("").describe(describeComponent({ wrapper : "html"})),
  image           : z.string().default(""),
  imageDescription: z.string().optional()
});

export type Hero = z.infer<typeof schema>;

export function template({hero}:PageData){
  return /*html*/`
<section class="hero" data-editor="hero">
  <main>${hero.content}</main>
  <img src="${hero.image}" alt="${hero.imageDescription ?? ""}"/>
</section>
`;
}