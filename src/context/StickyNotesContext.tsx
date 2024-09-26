import { createContext, ReactNode, useEffect, useState } from 'react'
import { Note } from '@/types'
import { useStickyNotes } from '@/hooks/use-sticky-notes'
import { STICKY_NOTES_COLLECTION_ID } from '@/constants'

type StickyNotesContextType = {
  stickyNotesCollectionId: string
  setStickyNotesCollectionId: (id: string) => void
  stickyNotes: Note[]
  isLoading: boolean
  lastStickyNoteDeletedId?: string
  actions: {
    addStickyNote: () => void
    softDeleteStickyNote: (id: string) => Promise<boolean>
    undoDeleteStickyNote: () => void
    updateStickyNote: (note: Partial<Note>) => void
  }
  disableCreate: boolean,
  setDisableCreate: (value: boolean) => void
}

export const StickyNotesContext = createContext<StickyNotesContextType>(
  {} as StickyNotesContextType
)

const StickyNotesProvider = ({ children }: { children: ReactNode }) => {
  const [stickyNotesCollectionId, setStickyNotesCollectionId] = useState<string>('')
  const {
    addStickyNote,
    softDeleteStickyNote,
    undoDeleteStickyNote,
    isLoading,
    stickyNotes,
    updateStickyNote,
    lastStickyNoteDeletedId,
    disableCreate,
    setDisableCreate,
  } = useStickyNotes({ collectionId: STICKY_NOTES_COLLECTION_ID })

  const contextData = {
    stickyNotes,
    setStickyNotesCollectionId,
    stickyNotesCollectionId,
    isLoading,
    lastStickyNoteDeletedId,
    actions: {
      addStickyNote,
      softDeleteStickyNote,
      undoDeleteStickyNote,
      updateStickyNote
    },
    disableCreate,
    setDisableCreate,
  }

  return (
    <StickyNotesContext.Provider value={contextData}>
      {children}
    </StickyNotesContext.Provider>
  )
}

export default StickyNotesProvider