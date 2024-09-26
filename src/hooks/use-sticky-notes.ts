import { useEffect, useState } from "react"
import { Note } from "@/types"
import { getRandomColorTheme } from "@/utils/theme";
import API from "@/api/stickyNotes.api";

export type UseStickyNotesData = {
  isLoading: boolean
  stickyNotes: Note[]
  addStickyNote: () => void
  softDeleteStickyNote: (id: string) => Promise<boolean>
  undoDeleteStickyNote: () => void
  updateStickyNote: (note: Partial<Note>) => void
  lastStickyNoteDeletedId?: string
  disableCreate: boolean
  setDisableCreate: (value: boolean) => void
}

type Props = {
  collectionId: string,
}

const DEFAULT_X_POSITION = 0
const DEFAULT_Y_POSITION = 0

export const useStickyNotes = ({ collectionId }: Props): UseStickyNotesData => {
  const [stickyNotes, setStickyNotes] = useState<Note[]>([])
  const [lastStickyNoteDeleted, setLastStickyNoteDeleted] = useState<Note | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [disableCreate, setDisableCreate] = useState<boolean>(false)
  
  const addStickyNote = async () => {
    const newNote = {
      collectionId,
      content: '',
      colorTheme: getRandomColorTheme(),
      positionX: DEFAULT_X_POSITION,
      positionY: DEFAULT_Y_POSITION,
    }

    const result = await API.createStickyNote({...newNote})
    
    if (!result) {
      console.log('Failed to create sticky note')
      return
    }

    setStickyNotes([...stickyNotes, result as Note])
  }

  const undoDeleteStickyNote = async () => {
    if (lastStickyNoteDeleted) {
      const result = await API.updateStickyNote({
        ...lastStickyNoteDeleted,
        deletedAt: null,
      })

      if (result && typeof result === 'object' && 'id' in result) {
        setStickyNotes([
          ...stickyNotes,
          result as Note,
        ]);
      }
      // updateStickyNote({
      //   ...lastStickyNoteDeleted,
      //   deletedAt: undefined,
      // })
    }
  }

  const softDeleteStickyNote = async (id: string) => {      
    let noteToDelete = undefined
    let newNotes: Note[] = []
    
    stickyNotes.forEach(note => {
      if (note.id === id) {
        noteToDelete = note
      } else {
        newNotes.push(note)
      }
    })
    
    const isDeleted = await API.softDeleteStickyNote(id)

    if (isDeleted) {
      setStickyNotes(newNotes)
      setLastStickyNoteDeleted(noteToDelete)
      return true
    }

    return false
  }

  const updateStickyNote = async (note: Partial<Note>) => {
    const result = await API.updateStickyNote(note)

    if (result && typeof result === 'object' && 'id' in result) {
      const newNotes = stickyNotes.map(note => (note.id === result.id ? result : note));
      setStickyNotes(newNotes);
    }
  }

  useEffect(() => {
    const fetchStickyNotes = async () => {
      setIsLoading(true)
      const result = await API.fetchStickyNotesByCollectionId(collectionId)

      if (result) {
        setStickyNotes(result as Note[])
      }

      setIsLoading(false)
    }
    
    fetchStickyNotes()
  }, [])

  return {
    isLoading,
    disableCreate,
    setDisableCreate,
    stickyNotes,
    addStickyNote,
    softDeleteStickyNote,
    undoDeleteStickyNote,
    updateStickyNote,
    lastStickyNoteDeletedId: lastStickyNoteDeleted?.id,
  }
}