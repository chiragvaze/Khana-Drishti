import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface DemoContextType {
  isActive: boolean
  currentStep: number
  startDemo: () => void
  exitDemo: () => void
  nextStep: () => void
  prevStep: () => void
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0) // 0 = Start Overlay, 9 = Completion Overlay
  const navigate = useNavigate()

  const stepRoutes = [
    '', // 0
    '/dashboard',
    '/map',
    '/evidence',
    '/ai-insights',
    '/compliance',
    '/capa',
    '/contractors',
    '/reports'
  ]

  const startDemo = () => {
    setIsActive(true)
    setCurrentStep(0)
  }

  const exitDemo = () => {
    setIsActive(false)
    setCurrentStep(0)
  }

  const nextStep = () => {
    if (currentStep < 9) {
      const next = currentStep + 1
      setCurrentStep(next)
      if (next >= 1 && next <= 8) {
        navigate(stepRoutes[next])
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      const prev = currentStep - 1
      setCurrentStep(prev)
      navigate(stepRoutes[prev])
    }
  }

  // Keyboard navigation
  useEffect(() => {
    if (!isActive) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      
      if (e.key === 'ArrowRight') {
        nextStep()
      } else if (e.key === 'ArrowLeft') {
        prevStep()
      } else if (e.key === 'Escape') {
        exitDemo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isActive, currentStep])

  return (
    <DemoContext.Provider value={{ isActive, currentStep, startDemo, exitDemo, nextStep, prevStep }}>
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  const context = useContext(DemoContext)
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider')
  }
  return context
}
