export async function post(url:string, data: any) {
  const rawdata = await fetch(url, {
    body   : JSON.stringify(data),
    headers: {
      "Accept"      : "application/json",
      "Content-Type": "application/json"
    },
    method: "POST"
  });
  if (!rawdata.ok) {
    const errorBody = await rawdata.text();
    throw new Error(`Fetcher POST failed with status: ${rawdata.status}. Body: ${errorBody}`);
  }
  return await rawdata.json();
}