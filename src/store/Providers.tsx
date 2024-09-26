'use client'
import { Provider } from 'react-redux'
import { store } from '.'
import StickyNotesProvider from '@/context/StickyNotesContext'

interface Props {
  children: React.ReactNode
}

export const Providers = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <StickyNotesProvider>
        {children}
      </StickyNotesProvider>
    </Provider>
  )
}