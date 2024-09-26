export type Note = {
  id: string,
  collectionId: string,
  content?: string,
  colorTheme: ColorTheme,
  position: { x: number, y: number },
  deletedAt: string | null,
}

export enum ColorTheme {
  Red = 'red',
  Green = 'green',
  Yellow = 'yellow',
  Blue = 'blue',
  Gray = 'gray',
  Default = 'default'
}
