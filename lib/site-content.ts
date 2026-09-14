import rawContent from '@/data/site-content.json'

export type EducationItem = {
  id: string
  year: string
  school: string
  detail: string
}

export type WorkItem = {
  id: string
  period: string
  role: string
  org: string
  location: string
  summary: string
  details: string[]
}

export type ProjectItem = {
  id: string
  year: string
  period: string
  role: string
  org: string
  image: string
  summary: string
  bullets: string[]
  tags: string[]
  skills: string[]
  link?: { label: string; href: string }
}

export type HobbyIcon = 'trophy' | 'disc' | 'snowflake' | 'martini' | 'camera' | 'utensils'

export type HobbyItem = {
  id: string
  title: string
  quote: string
  image: string
  icon: HobbyIcon
}

export type SiteContent = {
  schemaVersion: 1
  skills: string[]
  education: EducationItem[]
  workExperience: WorkItem[]
  projects: ProjectItem[]
  hobbies: HobbyItem[]
}

export const siteContent = rawContent as SiteContent

export function validateSiteContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== 'object') return false
  const content = value as Partial<SiteContent>
  if (content.schemaVersion !== 1) return false
  if (!validCollection(content.skills, validString, 1, 100)) return false
  if (!validCollection(content.education, validEducation, 1, 30)) return false
  if (!validCollection(content.workExperience, validWork, 1, 50)) return false
  if (!validCollection(content.projects, validProject, 1, 100)) return false
  if (!validCollection(content.hobbies, validHobby, 1, 50)) return false
  const ids = [...content.education, ...content.workExperience, ...content.projects, ...content.hobbies].map((item) => item.id)
  if (new Set(ids).size !== ids.length) return false
  return true
}

const validString = (value: unknown) => typeof value === 'string' && value.trim().length > 0 && value.length <= 5000
const validStringArray = (value: unknown) => validCollection(value, validString, 0, 100)

function validCollection(value: unknown, validator: (item: unknown) => boolean, min: number, max: number): value is unknown[] {
  return Array.isArray(value) && value.length >= min && value.length <= max && value.every(validator)
}

function validEducation(value: unknown) {
  if (!value || typeof value !== 'object') return false
  const item = value as EducationItem
  return validString(item.id) && validString(item.year) && validString(item.school) && validString(item.detail)
}

function validWork(value: unknown) {
  if (!value || typeof value !== 'object') return false
  const item = value as WorkItem
  return [item.id, item.period, item.role, item.org, item.location, item.summary].every(validString) && validStringArray(item.details)
}

function validProject(value: unknown) {
  if (!value || typeof value !== 'object') return false
  const item = value as ProjectItem
  const linkValid = item.link === undefined || (validString(item.link.label) && /^https?:\/\//.test(item.link.href))
  return [item.id, item.year, item.period, item.role, item.org, item.image, item.summary].every(validString)
    && validStringArray(item.bullets)
    && validStringArray(item.tags)
    && validStringArray(item.skills)
    && linkValid
}

function validHobby(value: unknown) {
  if (!value || typeof value !== 'object') return false
  const item = value as HobbyItem
  return [item.id, item.title, item.quote, item.image, item.icon].every(validString)
    && ['trophy', 'disc', 'snowflake', 'martini', 'camera', 'utensils'].includes(item.icon)
}
