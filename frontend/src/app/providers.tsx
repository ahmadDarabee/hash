import type { ReactNode } from 'react'
import { Provider } from 'react-redux'

import { CommandPaletteProvider } from '../components/ui/CommandPalette'
import { ToastProvider } from '../components/ui/Toast'
import { ThemeProvider } from '../theme'
import { store } from './store'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ToastProvider>
          <CommandPaletteProvider>{children}</CommandPaletteProvider>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  )
}
