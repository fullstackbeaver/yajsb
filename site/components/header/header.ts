import { z } from "zod";

import type { WrapperEditor } from "@core/components/components.types";
import type { Global }        from "@coreComponents/global/global.types"

export const description = "header description";

export const schema = z.object({
  duration       : z.number().default(0),
  image          : z.string().default(""),
  metaDescription: z.string().default(""),
  pageType       : z.enum(["article", "website"]).default("website")
});

export const wrapperEditor:WrapperEditor = {
  imagePicker : ["image"]
}

export type Header = z.infer<typeof schema>;

type Arguments = {
  global: Global
  header: Header
}

export function template({global, header}:Arguments){

  const modification = global.modificationDate ? `<meta property="article:modified_time"  content="${global.modificationDate}" />` : "";

  return`
<meta http-equiv="Content-Type"         content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible"      content="IE=edge" />
<meta name="viewport"                   content="width=device-width, initial-scale=1" />
<meta name="robots"                     content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
<meta name="description"                content="${header.metaDescription}" />
<meta name="author"                     content="Lionel" />
<meta name="twitter:card"               content="summary_large_image" />
<meta name=”twitter:image”              content="${header.image}" />
<meta name="twitter:label1"             content="Écrit par" />
<meta name="twitter:data1"              content="Lionel" />
<meta name="twitter:label2"             content="Durée de lecture estimée" />
<meta name="twitter:data2"              content="=${header.duration} minute${header.duration === 1 ? "" : "s"}" />
<meta property="og:locale"              content="${global.lang}_${global.lang.toUpperCase()}" />
<meta property="og:type"                content="${header.pageType}" />
<meta property="og:title"               content="${global.title}" />
<meta property="og:description"         content="${header.metaDescription}" />
<meta property="og:url"                 content="${global.url}" />
<meta property="og:site_name"           content="Le monde merveilleux de Lionel" />
<meta property="article:published_time" content="${global.creationDate}" />
${modification}

<title>${global.title}</title>
<link rel="shortcut icon" href="/assets/favicon.ico">
<link rel="canonical"     href="${global.url}" />
`;
}