'use client'

import type { Role } from '@/lib/auth/types'
import { ROLE_META } from '@/lib/auth/constants'

interface RoleCardProps {
  role: Role
  isActive?: boolean
  onClick: (role: Role) => void
}

export function RoleCard({ role, isActive = false, onClick }: RoleCardProps) {
  const meta = ROLE_META[role] ?? { label: role, description: '', icon: 'badge' }

  return (
    <button
      type="button"
      onClick={() => onClick(role)}
      className={[
        'group relative flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-200 text-center w-full',
        isActive
          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 hover:border-primary/60 hover:bg-primary/5 hover:shadow-md',
      ].join(' ')}
      aria-pressed={isActive}
    >
      {/* Icon */}
      <div
        className={[
          'size-14 rounded-xl flex items-center justify-center transition-colors',
          isActive
            ? 'bg-primary text-white'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-primary/20 group-hover:text-primary',
        ].join(' ')}
      >
        <span className="material-symbols-outlined text-3xl" aria-hidden="true">
          {meta.icon}
        </span>
      </div>

      {/* Label */}
      <div>
        <p className={[
          'font-bold text-base',
          isActive ? 'text-primary' : 'text-slate-800 dark:text-slate-200',
        ].join(' ')}>
          {meta.label}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          {meta.description}
        </p>
      </div>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute top-3 right-3 size-5 rounded-full bg-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-sm" aria-hidden="true">
            check
          </span>
        </div>
      )}
    </button>
  )
}
