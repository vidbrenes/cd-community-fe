'use client'

import { MouseEventHandler, useRef, useState, KeyboardEvent, useEffect } from 'react';
import { FaRegTrashCan, FaSpinner } from "react-icons/fa6";
// import { COLOR_THEME } from '@/utils/theme';
import { ColorTheme, Note } from '@/types';

type Props = {
  note: Note,
  onDelete: (id: string) => void,
  onUpdate: (note: Partial<Note>) => void
  blockCreate: (value: boolean) => void
}

export const COLOR_THEME = {
  'red': {
    header: 'bg-orange-300',
    body: 'bg-orange-200',
    text: 'text-orange-700',
  },
  'green': {
    header: 'bg-green-300',
    body: 'bg-green-200',
    text: 'text-green-700',
  },
  'yellow': {
    header: 'bg-yellow-300',
    body: 'bg-yellow-200',
    text: 'text-yellow-700',
  },
  'blue': {
    header: 'bg-blue-300',
    body: 'bg-blue-200',
    text: 'text-blue-700',
  },
  'gray': {
    header: 'bg-slate-300',
    body: 'bg-slate-200',
    text: 'text-slate-700',
  },
  'default': {
    header: 'bg-slate-300',
    body: 'bg-slate-200',
    text: 'text-slate-700',
  },
}

const SAVE_TIMER_MILISECONDS = 500

const StickyNote = ({
  note,
  onDelete,
  onUpdate,
  blockCreate
}: Props) => {
  const [currentNote, setCurrentNote] = useState<Note>(note)
  const theme = COLOR_THEME[currentNote.colorTheme]
  const [notePosition, setNotePosition] = useState(currentNote.position || { x: 0, y: 0 })
  const noteRef = useRef<HTMLDivElement>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  let mouseStartPosition = { x: 0, y: 0 }

  const handleMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    mouseStartPosition.x = e.clientX
    mouseStartPosition.y = e.clientY

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    setNotesZIndex()
  }

  const handleMouseMove = (e: MouseEvent) => {
    const direction = {
      x: e.clientX - mouseStartPosition.x,
      y: e.clientY - mouseStartPosition.y,
    }

    mouseStartPosition.x = e.clientX
    mouseStartPosition.y = e.clientY

    const newXPosition = (noteRef.current ? noteRef.current.offsetLeft : 0) + direction.x
    const newYPosition = (noteRef.current ? noteRef.current.offsetTop : 0) + direction.y

    setNotePosition({
      x: newXPosition < 0 ? 0 : newXPosition,
      y: newYPosition < 0 ? 0 : newYPosition,
    })

    saveChanges({
      id: currentNote.id,
      position: {
        x: newXPosition,
        y: newYPosition,
      },
    })
  }

  const handleMouseUp = async (e: MouseEvent) => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  // This allows to put the selected note on top of the others on move and on content click (focus)
  const setNotesZIndex = () => {
    const allNotes = document.querySelectorAll('.sticky-note')
    const selectedNote = noteRef.current as HTMLDivElement
    selectedNote.style.zIndex = `${999}`

    allNotes.forEach((note, i) => {
      if (note instanceof HTMLDivElement && note !== selectedNote) {
        note.style.zIndex = `${999 - i}`
      }
    })
  }

  const handleOnKeyUp = (e: KeyboardEvent) => {
    const newContent = (e.target as HTMLTextAreaElement).value
    setCurrentNote(prev => ({
      ...prev,
      content: newContent,
    }))

    saveChanges({
      id: currentNote.id,
      content: newContent,
    })
  }

  const handleOnDelete = () => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current)
    }

    onDelete(currentNote.id)
  }

  const saveChanges = (note: Partial<Note>) => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current)
    }

    setIsSaving(true)
    blockCreate(true)

    saveTimer.current = setTimeout(() => {
      onUpdate(note)
      setIsSaving(false)
      blockCreate(false)
    }, SAVE_TIMER_MILISECONDS)
  }

  return (
    <div
      data-id={currentNote.id}
      ref={noteRef}
      className={`sticky-note flex flex-col absolute ${theme.header} w-72 h-72 rounded-lg shadow-lg`}
      style={{
        top: `${notePosition.y}px`,
        left: `${notePosition.x}px`,
      }}
    >
      <div
        className={`flex justify-between ${theme.body} ${theme.text} h-9 opacity-60 rounded-tl-lg rounded-tr-lg hover:cursor-pointer`}
      >
        <div
          className='basis-auto w-full'
          onMouseDown={handleMouseDown}
        ></div>
        <div className='flex justify-end items-center'>
          {isSaving ? (
            <div className='flex items-center'>
              <span>Saving</span>
              <div className='px-1'>
                <FaSpinner className='animate-spin' />
              </div>
            </div>
          ) : (
            <div className='px-2 hover:text-black' onClick={handleOnDelete}>
              {/* <div className='px-2 hover:text-black' onClick={() => onDelete(currentNote.id)}> */}
              <FaRegTrashCan size={20} />
            </div>
          )}
        </div>
      </div>
      <div
        className={`p-2 h-full opacity-95 overflow-scroll ${theme.text}`}
        onFocus={setNotesZIndex}
      >
        <textarea
          className='bg-inherit min-w-full min-h-full resize-none focus:outline-none'
          // name=""
          // id=""
          defaultValue={currentNote.content}
          onKeyUp={handleOnKeyUp}
        ></textarea>
      </div>
    </div>
  )
}

export default StickyNote