export type Pattern = boolean[][]
export type Track = { name: string; voice: string }
export type SaveData = {
  pattern: Pattern
  tempo: number
  volume: number
  tracks?: Track[]
}

const KEY = "drum-machine-state-v1"

export function loadState(): SaveData | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (
      !parsed ||
      !Array.isArray(parsed.pattern) ||
      typeof parsed.tempo !== "number" ||
      typeof parsed.volume !== "number"
    ) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function saveState(data: SaveData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // ignore write errors
  }
}
