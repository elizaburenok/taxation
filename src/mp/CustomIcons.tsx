/* Custom Tochka bank SVG icons */

interface IconProps {
  size?: number
  color?: string
}

/** Иконка «Бухгалтерия» (плюс/минус с дробной чертой) — правый аксессуар навигатора «Задачи». */
export function IconBookkeeping({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.793 2.79297C20.1835 2.40246 20.8165 2.40249 21.207 2.79297C21.5976 3.18349 21.5976 3.81651 21.207 4.20703L4.20703 21.207C3.8165 21.5975 3.18348 21.5975 2.79297 21.207C2.40251 20.8165 2.40251 20.1835 2.79297 19.793L19.793 2.79297ZM21 17C21.5523 17 22 17.4477 22 18C22 18.5523 21.5523 19 21 19H15C14.4477 19 14 18.5523 14 18C14 17.4477 14.4477 17 15 17H21ZM6 2C6.55228 2 7 2.44772 7 3V5H9C9.55228 5 10 5.44772 10 6C10 6.55228 9.55228 7 9 7H7V9C7 9.55228 6.55228 10 6 10C5.44772 10 5 9.55228 5 9V7H3C2.44772 7 2 6.55228 2 6C2 5.44772 2.44772 5 3 5H5V3C5 2.44772 5.44772 2 6 2Z"
        fill={color}
      />
    </svg>
  )
}

export function IconEmblemT({ size = 30, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 8.5C6 7.4 6.9 6.5 8 6.5h14c1.1 0 2 .9 2 2v1.5H17V23h-4V10H6V8.5z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function IconEmblemPercent({ size = 30, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15 6C10 6 6 10 6 15s4 9 9 9 9-4 9-9-4-9-9-9z"
        stroke={color}
        strokeWidth="1.8"
        fill="none"
      />
      <circle cx="11.5" cy="11.5" r="1.5" fill={color} />
      <circle cx="18.5" cy="18.5" r="1.5" fill={color} />
      <line x1="20" y1="10" x2="10" y2="20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconMoneybox({ size = 30, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="15" cy="17" rx="8" ry="7" stroke={color} strokeWidth="1.8" />
      <path d="M19 11c1.5-1 3-3.5 1-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15 10V8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="21" y1="16" x2="23" y2="16" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 17h2l1 2 1-3 1 2h1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconTaxDocument({ size = 32, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="4" width="14" height="18" rx="2" stroke={color} strokeWidth="1.8" />
      <path d="M10 9h8M10 13h6M10 17h4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="22" cy="22" r="6" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" />
      <path d="M19.5 22h5M22 19.5v5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function IconMail({ size = 32, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="9" width="24" height="16" rx="2" stroke={color} strokeWidth="1.8" />
      <path d="M4 11l12 9 12-9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconTaxReports({ size = 32, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="3" width="16" height="20" rx="2" stroke={color} strokeWidth="1.8" />
      <path d="M9 9h10M9 13h8M9 17h5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <rect x="4" y="8" width="16" height="20" rx="2" fill="white" stroke={color} strokeWidth="1.8" />
      <path d="M7 14h10M7 18h8M7 22h5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconOperations({ size = 30, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="15" r="9" stroke={color} strokeWidth="1.8" />
      <path d="M15 9v6l4 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 15c0-4.97 4.03-9 9-9" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5 11l1 4 3-2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconDocBookList({ size = 30, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="4" width="16" height="22" rx="2" stroke={color} strokeWidth="1.8" />
      <path d="M11 9h8M11 13h8M11 17h5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="7" y1="4" x2="7" y2="26" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function IconPersonMagnifier({ size = 30, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="11" r="4" stroke={color} strokeWidth="1.8" />
      <path d="M5 25c0-4 3.13-7 7-7h4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="21" cy="21" r="4" stroke={color} strokeWidth="1.8" />
      <line x1="24" y1="24" x2="27" y2="27" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconDocUpdates({ size = 30, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="4" width="14" height="18" rx="2" stroke={color} strokeWidth="1.8" />
      <path d="M9 9h8M9 13h6M9 17h4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 18c2.5 0 4.5 2 4.5 4.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M21 21.5l2.5-2 1 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconPen({ size = 30, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 6l4 4-13 13H7v-4L20 6z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M17 9l4 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconBasket({ size = 30, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 10h18l-2 12H8L6 10z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M11 10l3-5M19 10l-3-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 10h18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconIntegration({ size = 30, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="3.5" stroke={color} strokeWidth="1.8" />
      <circle cx="21" cy="21" r="3.5" stroke={color} strokeWidth="1.8" />
      <rect x="17" y="5" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8" />
      <path d="M12 9h3M9 12v3M17 21h-3M21 17v-3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconTariff({ size = 30, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="20" height="20" rx="3" stroke={color} strokeWidth="1.8" />
      <path
        d="M10 12.5C10 11.4 10.9 10.5 12 10.5h6c1.1 0 2 .9 2 2v1H15.5v6h-3v-6H10v-1z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
