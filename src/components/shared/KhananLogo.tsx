import { cn } from '../../lib/utils'

// ──────────────────────────────────────────────
// Centralized Logo Asset Paths
// ──────────────────────────────────────────────
export const LOGO_FULL = '/logo/text_logo_combine.png'
export const LOGO_ICON = '/logo/ony_logo.png'
export const LOGO_TEXT = '/logo/only_text.png'

// ──────────────────────────────────────────────
// Logo Variant & Size Types
// ──────────────────────────────────────────────
type LogoVariant = 'full' | 'icon' | 'text'
type LogoSize = 'sm' | 'md' | 'lg'

interface KhananLogoProps {
  variant?: LogoVariant
  size?: LogoSize
  className?: string
  /** If true, disables mix-blend-mode (for light backgrounds like reports) */
  lightBackground?: boolean
}

const variantConfig: Record<LogoVariant, { src: string; alt: string }> = {
  full: { src: LOGO_FULL, alt: 'Khanan Drishti — Safer Mines, Stronger Tomorrow' },
  icon: { src: LOGO_ICON, alt: 'Khanan Drishti' },
  text: { src: LOGO_TEXT, alt: 'Khanan Drishti — Safer Mines, Stronger Tomorrow' },
}

const sizeClasses: Record<LogoVariant, Record<LogoSize, string>> = {
  full: {
    sm: 'h-[40px]',
    md: 'h-[56px]',
    lg: 'h-[80px]',
  },
  icon: {
    sm: 'h-[28px] w-[28px]',
    md: 'h-[36px] w-[36px]',
    lg: 'h-[48px] w-[48px]',
  },
  text: {
    sm: 'h-[28px]',
    md: 'h-[40px]',
    lg: 'h-[56px]',
  },
}

export default function KhananLogo({
  variant = 'full',
  size = 'md',
  className,
  lightBackground = false,
}: KhananLogoProps) {
  const config = variantConfig[variant]
  const sizeClass = sizeClasses[variant][size]

  return (
    <img
      src={config.src}
      alt={config.alt}
      className={cn(
        'object-contain select-none pointer-events-none flex-shrink-0',
        !lightBackground && 'mix-blend-lighten',
        sizeClass,
        className
      )}
      draggable={false}
    />
  )
}
