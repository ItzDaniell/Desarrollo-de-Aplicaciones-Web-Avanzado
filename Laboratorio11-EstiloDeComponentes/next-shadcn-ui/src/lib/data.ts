"use client"

export type Project = {
  id: string
  name: string
  description?: string
  category?: string
  priority?: string
  members?: string[] // userIds
}

export type Member = {
  userId: string
  role?: string
  name: string
  email?: string
  position?: string
  birthdate?: string
  phone?: string
  projectId?: string
  isActive?: boolean
}

export type Task = {
  id: string
  description: string
  projectId?: string
  status?: string
  priority?: string
  userId?: string
  dateline?: string
}

const LS_KEYS = {
  projects: "app_projects_v1",
  members: "app_members_v1",
  tasks: "app_tasks_v1",
  settings: "app_settings_v1",
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = globalThis?.localStorage?.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch (e) {
    return fallback
  }
}

function write(key: string, value: any) {
  try {
    globalThis?.localStorage?.setItem(key, JSON.stringify(value))
  } catch (e) {
    // ignore
  }
}

// Projects
export function getProjects(): Project[] {
  return read<Project[]>(LS_KEYS.projects, [])
}

export function createProject(p: Omit<Project, "id">): Project {
  const projects = getProjects()
  const project: Project = { id: String(Date.now()) + Math.random().toString(36).slice(2,8), ...p }
  projects.unshift(project)
  write(LS_KEYS.projects, projects)
  return project
}

export function deleteProject(id: string) {
  const projects = getProjects().filter((p) => p.id !== id)
  write(LS_KEYS.projects, projects)
}

export function getProjectById(id: string) {
  return getProjects().find((p) => p.id === id) || null
}

// Members
export function getMembers(): Member[] {
  return read<Member[]>(LS_KEYS.members, [])
}

export function createMember(m: Omit<Member, "userId">): Member {
  const members = getMembers()
  const member: Member = { userId: String(Date.now()) + Math.random().toString(36).slice(2,6), ...m }
  members.unshift(member)
  write(LS_KEYS.members, members)
  return member
}

export function updateMember(userId: string, changes: Partial<Member>): Member | null {
  const members = getMembers()
  const idx = members.findIndex((x) => x.userId === userId)
  if (idx === -1) return null
  members[idx] = { ...members[idx], ...changes }
  write(LS_KEYS.members, members)
  return members[idx]
}

export function deleteMember(userId: string) {
  const members = getMembers().filter((m) => m.userId !== userId)
  write(LS_KEYS.members, members)
}

export function getMemberById(userId: string) {
  return getMembers().find((m) => m.userId === userId) || null
}

// Tasks
export function getTasks(): Task[] {
  return read<Task[]>(LS_KEYS.tasks, [])
}

export function getTaskById(id: string) {
  return getTasks().find((t) => t.id === id) || null
}

export function createTask(t: Omit<Task, "id">): Task {
  const tasks = getTasks()
  const task: Task = { id: String(Date.now()) + Math.random().toString(36).slice(2,6), ...t }
  tasks.unshift(task)
  write(LS_KEYS.tasks, tasks)
  return task
}

export function updateTask(id: string, changes: Partial<Task>): Task | null {
  const tasks = getTasks()
  const idx = tasks.findIndex((x) => x.id === id)
  if (idx === -1) return null
  tasks[idx] = { ...tasks[idx], ...changes }
  write(LS_KEYS.tasks, tasks)
  return tasks[idx]
}

export function deleteTask(id: string) {
  const tasks = getTasks().filter((t) => t.id !== id)
  write(LS_KEYS.tasks, tasks)
}

// Settings
export type Settings = {
  appName?: string
  itemsPerPage?: number
  enableNotifications?: boolean
}

export function getSettings(): Settings {
  return read<Settings>(LS_KEYS.settings, { appName: "Mi App", itemsPerPage: 5, enableNotifications: true })
}

export function setSettings(s: Settings) {
  write(LS_KEYS.settings, s)
}
