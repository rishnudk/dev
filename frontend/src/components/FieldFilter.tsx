'use client'

import { FieldType } from '@/types'

const FIELDS: { id: FieldType; label: string }[] = [
  { id: 'ALL',       label: 'All'        },
  { id: 'FRONTEND',  label: 'Frontend'   },
  { id: 'BACKEND',   label: 'Backend'    },
  { id: 'FULLSTACK', label: 'Full Stack' },
  { id: 'MOBILE',    label: 'Mobile'     },
  { id: 'DEVOPS',    label: 'DevOps'     },
  { id: 'DATA',      label: 'Data'       },
  { id: 'DESIGN',    label: 'Design'     },
]

interface Props {
  active:   FieldType
  onChange: (field: FieldType) => void
}

export default function FieldFilter({ active, onChange }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {FIELDS.map((f) => (
        <button
          key={f.id}
          onClick={() => onChange(f.id)}
          className={`px-3 py-1.5 rounded-full text-sm
                     transition-all duration-150 border ${
            active === f.id
              ? 'bg-indigo-600 border-indigo-500 text-white'
              : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}