let data = {
  authentified: false,
  token       : "",
  user        : ""
};

export function isAuthentified() {
  return data.authentified;
}

export function getCredentials() {
  return data;
}

export function setCredentials(newData:{authentified?: boolean, token?: string, user?: string}) {
  data = {
    ...data,
    ...newData
  };
  return true;
}

export async function checkCredentials() {
  // const result = post("http://localhost:3000/api/login/check", { token: data.token, user: data.user });
  return true;
}