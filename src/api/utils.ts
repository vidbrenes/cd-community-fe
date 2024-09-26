export const serializeStickyNoteJSON = (data: any) => {
  return {
    id: data.id,
    collectionId: data.collectionId,
    content: data.content,
    colorTheme: data.colorTheme,
    position: {
      x: data.positionX,
      y: data.positionY,
    },
    deletedAt: data.deletedAt,
  }
}