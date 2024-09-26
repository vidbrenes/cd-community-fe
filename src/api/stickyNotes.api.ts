import { ColorTheme, Note } from "@/types"
import { serializeStickyNoteJSON } from "./utils"

type StickyNoteResponseData = {
  status: string,
  data?: Note 
}

const URL = `${process.env.NEXT_PUBLIC_API_V1}/stickyNotes`

export const fetchStickyNotesByCollectionId = async (collectionId: string) => {
  try {
    const response = await fetch(`${URL}/${collectionId}`)
    const { data } = await response.json() as { data: Note[] }

    if (data.length > 0) {
      return data.map(serializeStickyNoteJSON).filter(note => !note.deletedAt)
    }

    return []
  } catch (error) {
    console.log('ERROR', error)
  }
}

export const createStickyNote = async ({
  collectionId,
  content,
  colorTheme = ColorTheme.Default,
  positionX = 0,
  positionY = 0,
}: {
  collectionId: string,
  content: string,
  colorTheme: ColorTheme,
  positionX: number,
  positionY: number,
}) => {
  try {
    const response = await fetch(`${URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        collectionId,
        content,
        colorTheme,
        positionX,
        positionY,
      })
    })

    const { data } = await response.json() as StickyNoteResponseData
    

    if (data) {
      return serializeStickyNoteJSON(data)
    }

    throw new Error('Failed to create sticky note')
  } catch (error) {
    console.log('ERROR', error)
  }
}

export const updateStickyNote = async (note: Partial<Note>) => {
  try {
    const formatAttributes = note.position ? {
      positionX: note.position.x,
      positionY: note.position.y,
    } : {}

    const response = await fetch(`${URL}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...note,
        ...formatAttributes,
      })
    })

    const { data } = await response.json() as StickyNoteResponseData
    
    if (data) {
      return serializeStickyNoteJSON(data)
    }

    throw new Error('Failed to update sticky note')
  } catch (error) {
    console.log('ERROR', error)
  }
}

export const softDeleteStickyNote = async (id: string) => {
  try {
    const response = await fetch(`${URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    })

    if (response.statusText === 'OK') {
      return true
    }

    throw new Error('Failed to delete sticky note')
  } catch (error) {
    console.log('ERROR', error)
    return false
  }
}

export default {
  fetchStickyNotesByCollectionId,
  createStickyNote,
  updateStickyNote,
  softDeleteStickyNote,
}