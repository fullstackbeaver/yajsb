import type { BunRequest, Serve, Server }   from "bun";
import      { handleRouteSite, routesSite } from "./routesSite";
import type { WorkRequest }                 from "ls4bun";
import      { routesAPI }                   from "./routesAPI";
import      { useMiddlewares }              from "ls4bun";
// import      { useMiddlewares } from "ls4bun";

let server = {} as Server;

const serverSettings ={
  error(error:Error) {
    const [status, msg] = error.message.includes("|")
      ? error.message.split("|")
      : ["500", error.message];
    console.error(error.message, { msg, status }, error.stack);

    return new Response(msg ?? error.message, {
      headers: {
        "Content-Type": "text/html",
      },
      status: parseInt(status)
    });
  },
  fetch: async (request: Request) => {
    return await handleRouteSite(request as BunRequest);
  },
  websocket: {
    message() {
      server.publish("connection", "connected");
    },
  },
  port  : 4001,
  routes: {
    ...routesAPI,
    ...routesSite
  },
};

export function runServer() {
  server = Bun.serve(serverSettings as Serve);
}

useMiddlewares({

  after: [ //TODO vérifier que cela fonctionne
    async (req:WorkRequest) => {
      req.result.headers.set("Cache-Control", "no-cache");
    }
  ]

  // before: [
  //   async (req:WorkRequest) => {
  //     if (req.url.includes("/routeWithMiddleware") && req.headers?.get("authorization") !== "Bearer xxxxx") throw new Error("401|Unauthorized");
  //   }]
});

/*
if you want to use validator schema directly in routes, you need
to register a function that validates the schema like this one.
In this example, the library used is zod.
useValidator((schema: any, data: unknown) => {
import type {WorkRequest} from "ls4bun";
// import      { useMiddlewares } from "ls4bun";
  const result = schema.safeParse(data);
  return result.success;
});
*/