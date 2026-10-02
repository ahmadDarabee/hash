import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { getStoredLanguage, type Language } from '../../i18n'

interface I18nState {
  language: Language
}

const initialState: I18nState = {
  language: getStoredLanguage(),
}

const i18nSlice = createSlice({
  name: 'i18n',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload
    },
  },
})

export const { setLanguage } = i18nSlice.actions
export default i18nSlice.reducer
