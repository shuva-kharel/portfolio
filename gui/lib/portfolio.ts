export type RawPortfolio = Record<string, any>

export type PortfolioData = {
  firstName: string
  lastName: string
  name: string
  role: string
  location: string
  status: string
  email: string
  resumeUrl: string
  projects: any[]
  skills: Record<string, string[]>
  education: any[]
  certifications: any[]
  socials: any[]
}

function line(lines: string[] = [], key: string) {
  const item = lines.find((entry) => entry.toLowerCase().startsWith(`${key.toLowerCase()} `))
  return item?.split(':').slice(1).join(':').trim() || '—'
}

export function extractGUIData(json: RawPortfolio): PortfolioData {
  const lines = json?.commands?.whoami?.lines || []
  const name = line(lines, 'Name')
  const parts = name.split(' ').filter(Boolean)
  const certifications = Object.values(json?.commands?.certifications?.categories || {}).flatMap((category: any) =>
    (category?.items || []).map((item: any) => ({ ...item, category: category.label })),
  )

  return {
    firstName: parts[0] || 'Shuva',
    lastName: parts.slice(1).join(' ') || 'Kharel',
    name,
    role: line(lines, 'Role'),
    location: line(lines, 'Based'),
    status: line(lines, 'Status'),
    email: json?.commands?.email?.address || '—',
    resumeUrl: json?.resume?.download_url || '#',
    projects: json?.commands?.projects?.items || [],
    skills: json?.commands?.skills?.categories || {},
    education: json?.commands?.education?.items || [],
    certifications,
    socials: json?.commands?.socials?.items || [],
  }
}

export const fallbackData: PortfolioData = {
  firstName: 'Shuva', lastName: 'Kharel', name: 'Shuva Kharel', role: 'Cybersecurity Student', location: 'Kathmandu, Nepal', status: 'Seeking cybersecurity internships & entry-level security roles', email: 'hey.shuva@gmail.com', resumeUrl: '/resume.pdf', projects: [], skills: {}, education: [], certifications: [], socials: [],
}
