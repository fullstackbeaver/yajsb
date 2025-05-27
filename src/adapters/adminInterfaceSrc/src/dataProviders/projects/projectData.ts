import { useLocation } from "@builder.io/qwik-city";

import type { GetProjectListResponse } from "@dataExchanges/project.types";
// import      { post }                   from "@data/fetcher";

export async function getProjectList(headers: Headers): Promise<GetProjectListResponse> {   // TODO: implement projectList
  // const projectList = await post("http://localhost:3000/api/projects");
  return [];
}

export async function addProject(name: string, userId: id) { return {}; }

export async function deleteProject(id: id, userId: id) { return {}; }

export async function updateProject(id: id, name: string, userId: id) { return {}; }

export async function addProjectMember(projectId: id, userId: id, memberName: string, role: number) { return {}; }

export function getCurrentProject() {
  const location = useLocation();
  // const [ action, project, ...path] = location.url.pathname.split("/"); // eslint-disable-line no-unused-vars
  // return project;
  return location.url.pathname.split("/")[1];
}