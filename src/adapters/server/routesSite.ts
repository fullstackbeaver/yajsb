import { addStaticFolder, handleRoute, sanitizeString } from "ls4bun";
import type {WorkRequest} from "ls4bun";

import type { BunRequest }  from "bun";
import { getFileTree } from "@core/siteTree";
import { renderPage } from "@core/pages/page";
// import type { WorkRequest } from "ls4bun";

// import { getComponent }     from "@core/components/component";
// import { getComponentData } from "@core/data/data";
// import { getFileTree }      from "@core/siteTree";
// import { renderPage }       from "@core/page";


export const routesSite = {
  // "/admin": (req:BunRequest) => handleRoute(req,{
  //   handler: async (request: WorkRequest) => {
  //     console.log("request", request.url);
  //     // if (!url) throw new Error("400|url not found");
  //     // return await renderPage(sanitizeString(request.url), true);
  //     return {"message": "hello"}
  //   }
  // }),


  // ["/siteTree"]: (req:BunRequest) => handleRoute(req,{
  //   handler: async () => {
  //     return {
  //       // data: await getFileTree(),
  //       data: [],
  //       status: 200
  //     };
  //   }
  // }),

  // [base+"/loadComponent/:component/:id"]: (req:BunRequest) => handleRoute(req,{
  //   handler: async (request: WorkRequest) => {

  //     //TODO déplacer dans un controller

  //     const { component, id } = request.params as { component: string, id: string };
  //     if (!component || !id) throw new Error("400|component not found");

  //     const { description, wrapperEditor, schema } = getComponent(component);
  //     const data = getComponentData(component, id, schema);

  //     return {
  //       data,
  //       description,
  //       wrapperEditor,
  //       status: 200
  //     }
  //   }
  // }),

  /*
  example how to use validator for input (available also for output)
  [base+"/add"]: {
    [Method.POST]: (req:BunRequest) =>  handleRoute(req,{
      handler: (request: WorkRequest) => {
        return "ok";
      },
      inputSchema: z.object({
        contactInfo: z.object({
          email: z.string().email(),
          name : z.string(),
          phone: z.string().optional(),
        }),
      })
    }) },
  */

  ...addStaticFolder(process.cwd()+"/site/public", "/"),
  ...addStaticFolder(__dirname+"/../adminInterface", "/_editor")
};

export async function handleRouteSite (req:BunRequest) {
  return await handleRoute(req,{
    handler: async (request: WorkRequest) => {
      const url = new URL(request.url).pathname;
      if (!getFileTree(false, false).includes(url)) throw new Error("404|page not found");

      return {
        status: 200,
        body: await renderPage(sanitizeString(url), true),
        headers : {
          "Content-Type": "text/html"
        }
      }
    },
  });
}