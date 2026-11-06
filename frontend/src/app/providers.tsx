import type { ReactNode } from 'react'
import { Provider } from 'react-redux'

import { CartDrawerProvider } from '../components/cart/CartDrawer'
import { CommandPaletteProvider } from '../components/ui/CommandPalette'
import { ToastProvider } from '../components/ui/Toast'
import { ThemeProvider } from '../theme'
import { store } from './store'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ToastProvider>
          <CommandPaletteProvider>
            <CartDrawerProvider>{children}</CartDrawerProvider>
          </CommandPaletteProvider>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  )
}
