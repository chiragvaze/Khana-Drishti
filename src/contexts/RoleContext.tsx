import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export type Role = 'MINE_OFFICIAL' | 'CORPORATE_MANAGEMENT' | 'REGULATORY_AUTHORITY'

interface RoleContextType {
  role: Role
  setRole: (role: Role) => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  // Default to Corporate Management as it has the broadest view by default
  const [role, setRole] = useState<Role>('CORPORATE_MANAGEMENT')

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return context
}
