import type { FormatedBytes } from '~~/shared/types'

export const formatBytes = (bytes?: number): FormatedBytes => {
  if (bytes === undefined) {
    return { bytes: 0, text: '0 B' }
  }

  const decimals = 2
  const trimTrailingZeros = true
  const base = 1024
  const units = ['B', 'Kb', 'Mb', 'Gb']

  if (!Number.isFinite(bytes) || bytes === 0) {
    return { bytes: 0, text: '0 B' }
  }

  const sign = bytes < 0 ? -1 : 1
  const abs = Math.abs(bytes)

  const i = Math.min(Math.floor(Math.log(abs) / Math.log(base)), units.length - 1)
  const raw = (abs / Math.pow(base, i)) * sign

  const usedDecimals = i === 0 ? 0 : decimals
  const factor = Math.pow(10, usedDecimals)
  const value = Math.round(raw * factor) / factor

  let numberText: string
  if (i === 0) {
    numberText = String(Math.trunc(value))
  } else {
    numberText = value.toFixed(usedDecimals)
    if (trimTrailingZeros) {
      numberText = numberText.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')
    }
  }

  return {
    bytes,
    text: `${numberText} ${units[i]}`
  }
}
