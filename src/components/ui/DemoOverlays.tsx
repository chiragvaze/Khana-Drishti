import { useDemo } from '../../contexts/DemoContext'
import { Play, X, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react'

export function DemoOverlays() {
  const { isActive, currentStep, startDemo, exitDemo, nextStep } = useDemo()

  // Only render if active and on step 0 (intro) or 9 (completion)
  if (!isActive) return null
  if (currentStep > 0 && currentStep < 9) {
    // While in steps 1-8, render the global backdrop to dim the rest of the app
    return <div className="fixed inset-0 bg-mine-black/60 backdrop-blur-[1px] pointer-events-none z-40 transition-all duration-500" />
  }

  const isCompletion = currentStep === 9

  return (
    <div className="fixed inset-0 z-[100] bg-mine-black/95 backdrop-blur-md flex items-center justify-center animate-fade-in p-4">
      <div className="max-w-xl w-full">
        
        {!isCompletion ? (
          // Intro Overlay
          <div className="bg-mine-black-light border border-border/50 rounded-lg shadow-2xl p-6 sm:p-8 relative overflow-hidden">
            {/* Decorative background accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber/5 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber/10 rounded-lg flex items-center justify-center border border-amber/20">
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 text-amber" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">KHANAN DRISHTI</h2>
                  <p className="text-amber text-xs sm:text-sm font-medium tracking-wide uppercase">From Field Evidence to Governance</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6 sm:mb-8">
                <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
                  Welcome to the interactive prototype demonstration.
                </p>
                <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
                  Follow a real-time compliance scenario across the Khanan Drishti platform. You will track a high-risk ventilation observation from the moment it is logged in the field, through AI verification, risk analysis, and final corrective action mapping.
                </p>
                
                <div className="bg-mine-black p-3 sm:p-4 rounded border border-border/30 mt-4 sm:mt-6">
                  <div className="text-xs text-text-muted mb-2 font-mono">SCENARIO TARGET</div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-primary font-medium text-sm">Mine WCL-04</span>
                    <span className="px-2 py-0.5 bg-red-900/30 text-red-400 border border-red-900/50 rounded text-xs">HIGH RISK</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 border-t border-border/30">
                <button
                  onClick={exitDemo}
                  className="px-6 py-3 text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" /> Exit
                </button>
                <button
                  onClick={nextStep}
                  className="flex-1 bg-amber hover:bg-amber-600 text-mine-black font-semibold py-3 px-6 rounded transition-colors flex items-center justify-center gap-2"
                >
                  Start Demo <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Completion Overlay
          <div className="bg-mine-black-light border border-border/50 rounded-lg shadow-2xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 rounded-lg flex items-center justify-center border border-green-500/20">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">KHANAN DRISHTI</h2>
                  <p className="text-green-500 text-xs sm:text-sm font-medium tracking-wide uppercase">From Field Evidence to Governance</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6 sm:mb-8">
                <p className="text-text-primary mb-4 font-medium text-sm sm:text-base">Scenario complete. The system successfully tracked:</p>
                
                {[
                  'Evidence captured securely',
                  'AI verification processed',
                  'Compliance mapping established',
                  'Risk automatically identified',
                  'Corrective action (CAPA) initiated',
                  'Contractor safety record linked',
                  'Statutory report generated'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-text-secondary text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500/70 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 pt-4 border-t border-border/30">
                <button
                  onClick={startDemo}
                  className="flex-1 bg-mine-black border border-border hover:border-text-muted text-text-primary font-medium py-3 px-6 rounded transition-colors"
                >
                  Restart Demo
                </button>
                <button
                  onClick={exitDemo}
                  className="flex-1 bg-amber hover:bg-amber-600 text-mine-black font-semibold py-3 px-6 rounded transition-colors"
                >
                  Exit Demo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function DemoControlBar() {
  const { isActive, currentStep, nextStep, prevStep, exitDemo } = useDemo()

  if (!isActive || currentStep === 0 || currentStep === 9) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-mine-black border-t border-amber/20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-fade-in pb-safe">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-0 sm:h-16 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
        
        {/* Top row on mobile: Info */}
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber animate-pulse"></div>
            <span className="text-text-primary font-bold tracking-widest text-xs sm:text-sm uppercase">DEMO</span>
          </div>
          <div className="h-4 w-px bg-border hidden sm:block"></div>
          <span className="text-text-secondary font-mono text-xs sm:text-sm">WCL-04</span>
          <div className="h-4 w-px bg-border hidden sm:block"></div>
          <span className="text-text-muted text-xs sm:text-sm">Step {currentStep}/8</span>
        </div>

        {/* Center: Progress dots — hidden on very small */}
        <div className="hidden md:flex items-center gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <div className="flex items-center" key={s}>
              <div className={`w-2.5 h-2.5 rounded-full transition-colors ${
                s === currentStep ? 'bg-amber shadow-[0_0_8px_rgba(245,158,11,0.8)]' :
                s < currentStep ? 'bg-amber/40' : 'bg-border'
              }`} />
              {s < 8 && (
                <div className={`w-8 h-px mx-1 ${s < currentStep ? 'bg-amber/40' : 'bg-border/50'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Bottom row on mobile: Controls */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="p-2 text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Previous Step (Left Arrow)"
            aria-label="Previous step"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={nextStep}
            className="flex items-center gap-1 bg-amber/10 hover:bg-amber/20 text-amber border border-amber/20 hover:border-amber/40 px-4 py-2 sm:py-1.5 rounded text-sm font-medium transition-all min-h-[44px] sm:min-h-0"
            title="Next Step (Right Arrow)"
          >
            {currentStep === 8 ? 'Finish' : 'Next'} <ChevronRight className="w-4 h-4" />
          </button>
          
          <div className="h-6 w-px bg-border mx-1 sm:mx-2"></div>
          
          <button
            onClick={exitDemo}
            className="text-text-muted hover:text-text-primary text-sm font-medium transition-colors flex items-center gap-1 p-2 sm:p-0"
            title="Exit Demo (Escape)"
            aria-label="Exit demo"
          >
            <X className="w-4 h-4" /> <span className="hidden sm:inline">Exit</span>
          </button>
        </div>

      </div>
    </div>
  )
}
