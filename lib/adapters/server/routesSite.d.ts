import type { BunRequest } from "bun";
export declare const routesSite: {
    [x: string]: Function;
};
export declare function handleRouteSite(req: BunRequest): Promise<Response>;
