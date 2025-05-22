import type { BunRequest } from "bun";
export declare const routesAPI: {
    [x: string]: ((req: BunRequest) => Promise<Response>) | {
        POST: (req: BunRequest) => Promise<Response>;
    };
};
