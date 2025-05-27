import      { Link, routeLoader$ }     from "@builder.io/qwik-city";
import      { Resource, component$ }   from "@builder.io/qwik";
import type { GetProjectListResponse } from "@dataExchanges/project.types";
import      { getProjectList }         from "@data/projects/projectData";

export const useListLoader = routeLoader$(async ({ request }) => {
  const headers = request.headers;
  return await getProjectList(headers);
});

export default component$(() => {
  const srcData = useListLoader();
  return (
    <Resource
      value      = {srcData}
      onPending  = {() => <p>Loading...</p>}
      onResolved = {() => showProjectsList(srcData as unknown as GetProjectListResponse)}
      onRejected = {(error) => <p>Error loading data: {error.message}</p>}
    />
  );
});

function showProjectsList(list:GetProjectListResponse){
  const projects = list.map((project) =>  <Link href={`/projects/${project}`}>{project}</Link>);
  projects.push(<Link href={"/project/new"}>Add project</Link>);
  return projects;
}

export const head = () => {
  const title = "Project list";
  const description = "-";

  return {
    meta: [
      {
        content: description,
        name   : "Meta.DESCRIPTION",
      },
    ],
    title
  };
};