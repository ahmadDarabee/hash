interface WindowChromeProps {
  title?: string
  className?: string
}

const DOT_COLORS = ['bg-[#ff5f57]', 'bg-[#febc2e]', 'bg-[#28c840]']

/** macOS-style window traffic lights, always in classic LTR order. */
export function WindowChrome({ title, className = '' }: WindowChromeProps) {
  return (
    <div className={`flex items-center gap-2 border-b border-line/60 px-3.5 py-2.5 ${className}`}>
      <div dir="ltr" className="flex items-center gap-1.5" aria-hidden="true">
        {DOT_COLORS.map((color) => (
          <span key={color} className={`h-3 w-3 rounded-full ${color} opacity-90`} />
        ))}
      </div>
      {title && (
        <span className="truncate ps-1 text-xs font-medium text-muted">{title}</span>
      )}
    </div>
  )
}
