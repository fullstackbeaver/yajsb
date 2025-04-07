const apiUrl = "/api/v1/";
async function fetcherGet(url) {
  const rawdata = await fetch(url);
  return await rawdata.json();
}

async function fetcherPost(url, data) {
  const rawdata = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept'      : 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!rawdata.ok) throw new Error(rawdata.statusText);
}

export async function loadPage(url) {
  return await fetcherGet(apiUrl+"load?u="+url+"&e=1"); //TODO change here for editor
}

export async function getPagesList() {
  return await fetcherGet(apiUrl+"getPages");
}

export async function fetchSavePage(rawData) {
  return await fetcherPost(apiUrl+"savePage", rawData);
}