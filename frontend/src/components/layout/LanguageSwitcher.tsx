import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setLanguage } from '../../features/i18n/i18nSlice'
import { GlobeIcon } from '../icons'

export function LanguageSwitcher() {
  const dispatch = useAppDispatch()
  const language = useAppSelector((state) => state.i18n.language)

  function toggle() {
    dispatch(setLanguage(language === 'ar' ? 'en' : 'ar'))
  }

  return (
    <button
      onClick={toggle}
      className="pressable flex h-9 items-center gap-1.5 rounded-full border border-line/70 bg-surface/50 px-2.5 text-sm font-semibold text-muted hover:border-brand/40 hover:text-ink"
      aria-label="Toggle language"
    >
      <GlobeIcon className="h-4 w-4" />
      <span className="font-mono text-xs">{language === 'ar' ? 'EN' : 'ع'}</span>
    </button>
  )
}
