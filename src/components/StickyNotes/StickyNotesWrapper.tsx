'use client'
import { useContext, useEffect, useState } from 'react'
import StickyNote from './StickyNote'
import { Snackbar } from '@mui/material';
import { StickyNotesContext } from '@/context/StickyNotesContext';
import { FaPlus, FaSpinner } from "react-icons/fa6";

const StickyNotesWrapper = () => {
  const [openToast, setOpenToast] = useState(false)
  // const [lastDeletedNoteId, setLastDeletedNoteId] = useState<string | null>(null)
  const {
    actions: {
      addStickyNote,
      softDeleteStickyNote,
      undoDeleteStickyNote,
      updateStickyNote,
    },
    isLoading,
    stickyNotes,
    disableCreate,
    setDisableCreate,
  } = useContext(StickyNotesContext)

  const handleOnDelete = async (id: string) => {
    const result = await softDeleteStickyNote(id)

    if (result) {
      setOpenToast(true)
    }
  }

  const handleUndoDelete = () => {
    setOpenToast(false)
    undoDeleteStickyNote()
  }

  const opacityTransition = (condition: boolean) => `transition-opacity duration-500 ${condition ? "opacity-100" : "opacity-0"}`

  return (
    <div className='bg-slate-500'>
      {stickyNotes && stickyNotes.map((note) => (
        <StickyNote
          key={note.id}
          note={note}
          onDelete={handleOnDelete}
          onUpdate={updateStickyNote}
          blockCreate={setDisableCreate}
        />
      ))}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openToast}
        autoHideDuration={6000}
        onClose={() => setOpenToast(false)}
        message="Note deleted"
        action={
          <>
            <button className='pr-2 font-bold text-orange-400 uppercase' type='button' onClick={handleUndoDelete}>Undo</button>
          </>
        }
      />
      <div className='flex absolute bottom-10 right-10' style={{ zIndex: '10000' }}>
        <div className='flex w-56 h-16 relative rounded-full'>
          <div className={`flex items-center w-full pl-4 bg-gray-200 font-bold rounded-full ${opacityTransition(isLoading)}`}>
            <p>Loading notes</p>
          </div>
          <div className='absolute top-0 right-0 w-16 h-16 rounded-full group'>
            {isLoading ? (
              <div className='flex justify-center items-center w-full h-full text-gray-400'>
                <FaSpinner className='animate-spin' size={24} />
              </div>
            ) : (
              <button
                className={`flex justify-center items-center w-full h-full bg-gray-300 text-gray-100 hover:cursor-pointer rounded-full ${disableCreate ? '' : 'group-hover:bg-gray-400'}`}
                type="button"
                onClick={addStickyNote}
                disabled={disableCreate}
              >
                <FaPlus size={24} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StickyNotesWrapper