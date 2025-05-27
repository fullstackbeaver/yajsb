export type AddProjectMemberRequest = {
  projectId : string
  userId    : string
  memberName: string
  role      : number
}

export type AddProjectMemberResponse = {
  projectId : string
  userId    : string
  memberName: string
  role      : number
}

export type AddProjectRequest = {
  name  : string
  userId: string
}

export type AddProjectResponse = {
  name  : string
  userId: string
}

export type DeleteProjectRequest = {
  id    : string
  userId: string
}

export type DeleteProjectResponse = {
  id    : string
  userId: string
}

export type GetProjectListRequest = {
  userId: string  // TODO: implement projectList
}

export type GetProjectListResponse = string[]

export type UpdateProjectRequest = {
  id    : string
  name  : string
  userId: string
}

export type UpdateProjectResponse = {
  id    : string
  name  : string
  userId: string
}