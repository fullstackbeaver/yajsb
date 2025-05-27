import      { checkCredentials, getCredentials } from "@data/login/loginData";
import type { RequestHandler }                   from "@builder.io/qwik-city";

export const onRequest: RequestHandler = async ({ next, redirect }) => {
  const isLocalhost = window.location.hostname === "localhost";
  const login       = "/login";
  const { token }   = getCredentials();

  if ( ! token && ! isLocalhost) throw redirect(302, login);

  if ( ! isLocalhost ) {
    const isValidToken = await checkCredentials();
    if ( ! isValidToken ) throw redirect(302, login);
  }

  next();
};