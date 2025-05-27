export type CheckCredentialsRequest = {
  token: string
  user : string
};

export type CheckCredentialsResponse = {
  success: boolean
};