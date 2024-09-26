import { ColorTheme } from "@/types"

export const getRandomColorTheme = () => 
  Object.values(ColorTheme)[Math.floor(Math.random() * Object.values(ColorTheme).length)]

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
