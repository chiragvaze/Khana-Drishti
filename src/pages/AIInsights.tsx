import { useState, useEffect } from 'react'
import { Brain, Search, ArrowRight, FileText, AlertTriangle, Zap, CheckCircle2, Info } from 'lucide-react'
import { useDemo } from '../contexts/DemoContext'
import DemoHighlight from '../components/shared/DemoHighlight'
const SUGGESTED_QUESTIONS = [
  "Why is WCL-04 high risk?",
  "Which mines have overdue CAPA?",
  "Which contractor requires review?",
  "What changed in compliance this week?"
]

export default function AIInsightsPage() {
  const [query, setQuery] = useState('')
  const [activeQuery, setActiveQuery] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)

  const handleQuerySubmit = (e?: React.FormEvent, q?: string) => {
    if (e) e.preventDefault()
    const textToSubmit = q || query
    if (!textToSubmit.trim()) return

    setQuery(textToSubmit)
    setIsTyping(true)
    setActiveQuery(null)

    // Simulate AI thinking time for the demo
    setTimeout(() => {
      setIsTyping(false)
      setActiveQuery(textToSubmit)
    }, 600)
  }

  // Auto-trigger demo query when Step 4 becomes active
  const { isActive: demoActive, currentStep } = useDemo()
  useEffect(() => {
    if (demoActive && currentStep === 4 && !activeQuery && !isTyping) {
      handleQuerySubmit(undefined, "Why is WCL-04 high risk?")
    }
  }, [demoActive, currentStep, activeQuery, isTyping])

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto px-2 sm:px-0">
      {/* Header */}
      <div className="mb-8 text-center mt-4">
        <div className="inline-flex items-center justify-center p-3 bg-amber-dim rounded-full mb-4">
          <Brain className="w-8 h-8 text-amber" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-text-primary tracking-wide">KHANAN AI</h1>
        <p className="text-[13px] text-text-muted mt-2 font-mono uppercase tracking-widest">
          Evidence-grounded compliance intelligence
        </p>
      </div>

      {/* Workspace Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-10 space-y-8">
        {!activeQuery && !isTyping && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto mt-8">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleQuerySubmit(undefined, q)}
                className="text-left p-4 bg-surface-raised border border-border rounded hover:border-amber/50 hover:bg-mine-black transition-colors group flex justify-between items-center"
              >
                <span className="text-[13px] text-text-secondary group-hover:text-text-primary">{q}</span>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-amber transition-colors" />
              </button>
            ))}
          </div>
        )}

        {isTyping && (
          <div className="flex items-center justify-center space-x-2 text-text-muted mt-12">
            <div className="w-2 h-2 bg-amber rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-amber rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-amber rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="text-[12px] ml-2 font-mono uppercase">Analyzing compliance data...</span>
          </div>
        )}

        {activeQuery === "Why is WCL-04 high risk?" && (
          <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
            <DemoHighlight step={4} tooltip="Khanan AI correlates field evidence with statutory obligations to explain risk scores.">
              {/* Answer Box */}
              <div className="bg-surface-raised border border-border rounded-lg overflow-hidden">
              <div className="p-5 border-b border-border bg-mine-black/50">
                <p className="text-[14px] text-text-primary leading-relaxed">
                  <strong className="text-amber">WCL-04 is classified as HIGH RISK</strong> in the prototype because of multiple contributing factors identified in recent inspections and telemetry data.
                </p>
              </div>

              <div className="p-5 space-y-6">
                {/* Risk Factors */}
                <div>
                  <h3 className="text-[11px] text-text-muted uppercase tracking-wider font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-red" /> Identified Risk Factors
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-[13px] text-text-secondary">
                    <li className="pl-2">Ventilation CAPA overdue</li>
                    <li className="pl-2">Missing verification evidence</li>
                    <li className="pl-2">Contractor safety observation</li>
                  </ol>
                </div>

                {/* Risk Propagation Flow */}
                <div>
                  <h3 className="text-[11px] text-text-muted uppercase tracking-wider font-semibold mb-3">
                    Risk Propagation
                  </h3>
                  <div className="flex items-center flex-wrap gap-2 text-[12px] font-mono text-text-primary bg-mine-black p-4 rounded border border-border-light">
                    <span className="bg-red-dim/20 text-red-light px-2 py-1 rounded">Ventilation CAPA</span>
                    <ArrowRight className="w-4 h-4 text-text-muted" />
                    <span className="bg-amber-dim/20 text-amber px-2 py-1 rounded">Compliance risk</span>
                    <ArrowRight className="w-4 h-4 text-text-muted" />
                    <span className="bg-blue-950/40 text-blue-400 px-2 py-1 rounded">Inspection priority</span>
                  </div>
                </div>

                {/* Evidence Card */}
                <div>
                  <h3 className="text-[11px] text-text-muted uppercase tracking-wider font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-amber" /> Key Evidence
                  </h3>
                  <div className="bg-mine-black border border-border rounded p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[14px] font-mono font-bold text-text-primary">KD-E102</span>
                        <span className="text-[10px] bg-green-dim text-green-light px-1.5 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> 94% Confidence
                        </span>
                      </div>
                      <p className="text-[12px] text-text-secondary mt-2">
                        <span className="text-text-muted">Applicable obligation:</span> [Demo clause reference] CMR 2017: Reg 153
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                      <button className="w-full sm:w-auto px-3 py-2 sm:py-1.5 bg-surface-raised border border-border text-text-secondary text-[12px] sm:text-[11px] rounded hover:text-text-primary hover:border-text-muted transition-colors">
                        View Evidence
                      </button>
                      <button className="w-full sm:w-auto px-3 py-2 sm:py-1.5 bg-surface-raised border border-border text-text-secondary text-[12px] sm:text-[11px] rounded hover:text-text-primary hover:border-text-muted transition-colors">
                        View Obligation
                      </button>
                      <button className="w-full sm:w-auto px-3 py-2 sm:py-1.5 bg-surface-raised border border-border text-text-secondary text-[12px] sm:text-[11px] rounded hover:text-text-primary hover:border-text-muted transition-colors">
                        View CAPA
                      </button>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </DemoHighlight>

            {/* AI Reasoning Trace */}
            <div className="border border-border-light rounded p-4 bg-mine-black/30">
              <h3 className="text-[10px] text-text-muted uppercase tracking-wider font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-3 h-3 text-amber" /> AI Reasoning Trace
              </h3>
              <div className="flex items-center flex-wrap gap-2 text-[11px] font-mono text-text-secondary">
                <span>Evidence analyzed</span>
                <ArrowRight className="w-3 h-3 text-text-muted" />
                <span>Relevant obligation identified</span>
                <ArrowRight className="w-3 h-3 text-text-muted" />
                <span>Risk factors evaluated</span>
                <ArrowRight className="w-3 h-3 text-text-muted" />
                <span className="text-text-primary">Risk classification generated</span>
              </div>
            </div>
          </div>
        )}

        {activeQuery && activeQuery !== "Why is WCL-04 high risk?" && (
          <div className="text-center text-text-muted text-[13px] py-10 max-w-lg mx-auto">
            <p>This query is not supported in the current demo prototype. Please select "Why is WCL-04 high risk?" to view the structured analysis capabilities.</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="pt-4 border-t border-border mt-auto shrink-0 max-w-3xl mx-auto w-full">
        <form onSubmit={handleQuerySubmit} className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Ask Khanan AI about risks, compliance, and governance..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-surface-raised border border-border rounded-full py-3.5 pl-12 pr-14 text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-amber/50 transition-colors shadow-sm"
          />
          <button
            type="submit"
            disabled={!query.trim() || isTyping}
            className="absolute right-2 p-2 bg-amber text-mine-black rounded-full hover:bg-amber-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-3 flex items-start justify-center gap-1.5 text-center px-4">
          <Info className="w-3.5 h-3.5 text-text-muted shrink-0 mt-0.5" />
          <p className="text-[10px] text-text-muted leading-relaxed max-w-lg">
            <strong>Prototype/demo AI outputs.</strong> This system is for demonstration purposes only. Do not claim regulatory validity or guaranteed accuracy. Always verify insights with official mine records.
          </p>
        </div>
      </div>
    </div>
  )
}
