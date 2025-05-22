import      { Method, handleRoute }    from "ls4bun";
import type { BunRequest }             from "bun";
import type { PartitalPageUpdateArgs } from "@core/pages/pages.types";
import type { WorkRequest }            from "ls4bun";
import      { getFileTree }            from "@core/siteTree";
import      { partialPageUpdate }      from "@core/pages/page";

const base = "/api/v1";

export const routesAPI = {
  [base+"/update-partial"]: {
    [Method.POST]: (req:BunRequest) => handleRoute(req,{
      handler: async (request: WorkRequest) => {

        //TODO ajouter vérif des données
        // const url    = request.query?.get("u");
        // if (!url) throw new Error("400|url not found");

        return {
          body  : await partialPageUpdate(await request.body as PartitalPageUpdateArgs),
          status: 200
        };
      }
    }) },

  [base+"/siteTree"]: (req:BunRequest) => handleRoute(req,{
    handler: async () => {
      return {
        body  : await getFileTree(false, true),
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
  //     // const data = getComponentData(component, id, schema);

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

  // ...addStaticFolder(__dirname+"/../adminInterface", "/")
};