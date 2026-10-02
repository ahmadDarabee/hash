import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setLanguage } from '../../features/i18n/i18nSlice'

export function LanguageSwitcher() {
  const dispatch = useAppDispatch()
  const language = useAppSelector((state) => state.i18n.language)

  function toggle() {
    dispatch(setLanguage(language === 'ar' ? 'en' : 'ar'))
  }

  return (
    <button
      onClick={toggle}
      className="rounded-md border border-gray-300 px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
      aria-label="Toggle language"
    >
      {language === 'ar' ? 'EN' : 'ع'}
    </button>
  )
}
