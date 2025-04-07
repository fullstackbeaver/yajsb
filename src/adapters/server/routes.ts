import      { addStaticFolder, handleRoute, sanitizeString } from "ls4bun";
import type { BunRequest }                                   from "bun";
import type { WorkRequest }                                  from "ls4bun";
import      { getComponent }                                 from "@core/components/component";
import      { getFileTree }                                  from "@core/siteTree";
import      { renderPage }                                   from "@core/page";
import { getComponentData } from "@core/data/data";

const base = "/api/v1";

export const localRoutes = {
  [base+"/loadPage"]: (req:BunRequest) => handleRoute(req,{
    handler: async (request: WorkRequest) => {

      const url    = request.query?.get("u");
      if (!url) throw new Error("400|url not found");

      const editor = request.query?.get("e");
      return {
        body: await renderPage(sanitizeString(url), editor === "1"),
        status: 200
      };
    }
  }),

  [base+"/siteTree"]: (req:BunRequest) => handleRoute(req,{
    handler: async () => {
      return {
        data: await getFileTree(),
        status: 200
      };
    }
  }),

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



  ...addStaticFolder(__dirname+"/../adminInterface", "/")
};