export const FIELD_LABELS: Record<string, string> = {
  FRONTEND:  'Frontend Developer',
  BACKEND:   'Backend Developer',
  FULLSTACK: 'Full Stack Developer',
  MOBILE:    'Mobile Developer',
  DEVOPS:    'DevOps Engineer',
  DATA:      'Data Engineer',
  DESIGN:    'Designer / Developer',
  OTHER:     'Developer',
}

export const getFieldLabel = (field: string | null) => {
  if (!field) return 'Developer'
  return FIELD_LABELS[field] ?? 'Developer'
}

export const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    year:  'numeric'
  })
}

export const getInitials = (name: string | null) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}