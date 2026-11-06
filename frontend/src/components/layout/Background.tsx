export function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg to-bg-2" />
      {/* Ambient color blobs — the glass panels blur these as content scrolls. */}
      <div className="bg-blob start-[-8rem] top-[-10rem] h-[26rem] w-[26rem] bg-brand/20" />
      <div className="bg-blob end-[-6rem] top-[16rem] h-[22rem] w-[22rem] bg-lime/15" />
      <div className="bg-blob start-[30%] bottom-[-12rem] h-[28rem] w-[28rem] bg-amber/10" />
      <div className="bg-blob end-[18%] top-[42rem] h-[18rem] w-[18rem] bg-brand/10" />
      {/* Fine grid overlay for a clinical, engineered feel. */}
      <div
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(var(--c-line) / 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--c-line) / 0.5) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)',
        }}
      />
    </div>
  )
}
