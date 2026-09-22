import type { ReactNode } from 'react'
import { useDemo } from '../../contexts/DemoContext'

interface DemoHighlightProps {
  step: number
  tooltip: string
  children: ReactNode
}

export default function DemoHighlight({ step, tooltip, children }: DemoHighlightProps) {
  const { isActive, currentStep } = useDemo()
  
  const isHighlighted = isActive && currentStep === step

  if (!isHighlighted) {
    return <>{children}</>
  }

  return (
    <div className="relative z-50 transition-all duration-300">
      {/* Highlight ring around the component */}
      <div className="relative z-10 ring-2 ring-amber ring-offset-4 ring-offset-mine-black rounded shadow-[0_0_30px_rgba(245,158,11,0.2)] bg-mine-black relative">
        {children}
      </div>
      
      {/* Tooltip */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-72 bg-mine-black-light border border-amber/40 rounded-lg p-4 shadow-2xl animate-fade-in pointer-events-auto z-50">
        {/* Tooltip triangle */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-px">
          <div className="border-8 border-transparent border-b-amber/40"></div>
          <div className="border-[7px] border-transparent border-b-mine-black-light absolute top-[2px] left-1/2 -translate-x-1/2"></div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-amber animate-pulse"></div>
          <span className="text-amber text-xs font-bold uppercase tracking-wider">Demo Step {step}</span>
        </div>
        <p className="text-sm text-text-primary leading-relaxed">
          {tooltip}
        </p>
      </div>
    </div>
  )
}
