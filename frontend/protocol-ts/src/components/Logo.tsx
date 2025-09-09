export function Logo(props: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div className="flex items-center gap-2" {...props}>
      {/* <svg viewBox="0 0 24 24" className="h-6 w-6 fill-emerald-400" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg> */}
      <span className="text-lg font-semibold text-zinc-900 dark:text-white">
        AyushBridge
      </span>
    </div>
  )
}
