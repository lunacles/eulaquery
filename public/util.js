import global from './global.js'
import Log from './log.js'

export const mixColors = (hex1, hex2, weight2 = 0.5) => {
  if (weight2 <= 0) return hex1
  if (weight2 >= 1) return hex2
  let weight1 = 1 - weight2
  let int1 = parseInt(hex1.slice(1, 7), 16)
  let int2 = parseInt(hex2.slice(1, 7), 16)
  let int =
    (((int1 & 0xff0000) * weight1 + (int2 & 0xff0000) * weight2) & 0xff0000) |
    (((int1 & 0x00ff00) * weight1 + (int2 & 0x00ff00) * weight2) & 0x00ff00) |
    (((int1 & 0x0000ff) * weight1 + (int2 & 0x0000ff) * weight2) & 0x0000ff)
  return '#' + int.toString(16).padStart(6, '0')
}

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export const sleep = ms => new Promise(r => setTimeout(r, ms))

export const measureText = (text, size) => {
  global.ctx.font = `${global.font.style} ${size}px ${global.font.family}`
  return global.ctx.measureText(text)
}

export const averageArray = array => array.length ? array.reduce((a, b) => a + b) / array.length : 0

export const sumArray = array => array.reduce((a, b) => a + b, 0)

export const fitTextToArea = ({ text = '', width = 0, height = 0 }) => {
  let aspectRatio = measureText(text, 200).width / 200
  let maxSizeWidth = width / aspectRatio
  return Math.min(maxSizeWidth, height)
}

let getSuffix = day => {
  let last = day % 10
  let lastTwo = day % 100
  if ([11, 12, 13].includes(lastTwo)) return 'th'
  switch (last) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}

export const formatDate = string => {
  let date = new Date(string)
  try {
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    if (!(date instanceof Date && !isNaN(date))) throw new Error('Invalid date')
    let day = date.getUTCDate()
    let name = months[date.getUTCMonth()]
    return `${name} ${day}${getSuffix(day)}, ${date.getUTCFullYear()}`
  } catch (err) {
    Log.error('Failed to retrieve date', err)
  }
}
