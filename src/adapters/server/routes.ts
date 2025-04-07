import      { addStaticFolder, handleRoute, sanitizeString } from "ls4bun";
import type { BunRequest }                                   from "bun";
import type { WorkRequest }                                  from "ls4bun";
import      { renderPage }                                   from "@core/page";

const base = "/api/v1";

export const localRoutes = {
  [base+"/load"]: (req:BunRequest) => handleRoute(req,{
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