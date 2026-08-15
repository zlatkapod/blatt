import type { ReactNode } from 'react'
import { href } from '../lib/router'

export function TopBar({ subtitle, children }: { subtitle?: string; children?: ReactNode }) {
  return (
    <header className="topbar">
      <a className="topbar__brand" href={href.library()}>
        <span className="topbar__mark">Blatt</span>
        {subtitle && <span className="topbar__sub caps">{subtitle}</span>}
      </a>
      <div className="topbar__actions">{children}</div>
    </header>
  )
}
