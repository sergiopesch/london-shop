import { LondonLogo } from "./london-logo"

interface RiverLogoProps {
  className?: string
}

export function RiverLogo({ className = "" }: RiverLogoProps) {
  return <LondonLogo className={className} />
}

