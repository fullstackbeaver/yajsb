import { z } from "zod";

import type { PageData} from "@site";

export const description = "head description";
export const isSingle    = true;
export const schema      = z.object({
  duration       : z.number().default(0),
  image          : z.string().default(""),
  metaDescription: z.string().default(""),
  pageType       : z.enum(["article", "website"]).default("website")
});

export type Head = z.infer<typeof schema>;

export function template({pageSettings, head}:PageData){

  const modification = pageSettings.modificationDate ? `<meta property="article:modified_time"  content="${pageSettings.modificationDate}" />` : "";

  return`
<meta http-equiv="Content-Type"         content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible"      content="IE=edge" />
<meta name="viewport"                   content="width=device-width, initial-scale=1" />
<meta name="robots"                     content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
<meta name="description"                content="${head.metaDescription}" />
<meta name="author"                     content="Lionel" />
<meta name="twitter:card"               content="summary_large_image" />
<meta name=”twitter:image”              content="${head.image}" />
<meta name="twitter:label1"             content="Écrit par" />
<meta name="twitter:data1"              content="Lionel" />
<meta name="twitter:label2"             content="Durée de lecture estimée" />
<meta name="twitter:data2"              content="=${head.duration} minute${head.duration === 1 ? "" : "s"}" />
<meta property="og:locale"              content="${pageSettings.lang}_${pageSettings.lang.toUpperCase()}" />
<meta property="og:type"                content="${head.pageType}" />
<meta property="og:title"               content="${pageSettings.title}" />
<meta property="og:description"         content="${head.metaDescription}" />
<meta property="og:url"                 content="${pageSettings.canonical}" />
<meta property="og:site_name"           content="Le monde merveilleux de Lionel" />
<meta property="article:published_time" content="${pageSettings.creationDate}" />
${modification}

<title>${pageSettings.title}</title>
<link rel="shortcut icon" href="/assets/favicon.ico">
<link rel="canonical"     href="${pageSettings.canonical}" />
`;
}