import { VOICE_CATALOG, categoryForVoice, type VoiceCategory } from "@/lib/voice-catalog"

export type VoiceName = string

export type RandomTrack = {
  id: string
  name: string
  voice: VoiceName
  volume: number // 0..1
  steps: boolean[]
}

type RNG = () => number
const rngDefault: RNG = () => Math.random()

function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    // @ts-ignore
    return crypto.randomUUID()
  }
  return `t_${Date.now()}_${Math.floor(Math.random() * 1e6)}`
}

// Category preferences (display names to match VoiceCategory)
const CORE_PREFS: VoiceCategory[] = ["Kicks", "Snares", "Hats", "Bass"]
const FILLER_PREFS: VoiceCategory[] = ["Percussion", "Cymbals", "Lead", "Pad", "FX"]

// Density caps (0..1) per display category
const DENSITY_CAP: Record<VoiceCategory | "default", number> = {
  Kicks: 0.25,
  Snares: 0.25,
  Hats: 0.45,
  Percussion: 0.35,
  Cymbals: 0.2,
  Bass: 0.25,
  Lead: 0.18,
  Pad: 0.15,
  FX: 0.12,
  default: 0.22,
}

// Default volumes (0..1) per display category
const DEFAULT_VOL: Record<VoiceCategory | "default", number> = {
  Kicks: 0.95,
  Snares: 0.85,
  Hats: 0.55,
  Percussion: 0.65,
  Cymbals: 0.6,
  Bass: 0.9,
  Lead: 0.75,
  Pad: 0.6,
  FX: 0.5,
  default: 0.7,
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v))
}

function choose<T>(arr: T[], rnd: RNG): T | undefined {
  if (!arr.length) return undefined
  return arr[Math.floor(rnd() * arr.length)]
}

function voicesForCategory(cat: VoiceCategory) {
  const group = VOICE_CATALOG.find((g) => g.category === cat)
  return group?.voices ?? []
}

function densityForCategory(cat: VoiceCategory): number {
  return DENSITY_CAP[cat] ?? DENSITY_CAP.default
}

function defaultVolumeForCategory(cat: VoiceCategory): number {
  return clamp01(DEFAULT_VOL[cat] ?? DEFAULT_VOL.default)
}

export function buildRandomTracks({
  stepCount,
  minTracks = 6,
  maxTracks = 10,
  rnd = rngDefault,
}: {
  stepCount: number
  minTracks?: number
  maxTracks?: number
  rnd?: RNG
}): RandomTrack[] {
  const count = minTracks === maxTracks ? minTracks : Math.floor(rnd() * (maxTracks - minTracks + 1)) + minTracks

  const picked: RandomTrack[] = []
  const usedVoices = new Set<string>()

  // 1) Core categories first
  for (const cat of CORE_PREFS) {
    const v = choose(voicesForCategory(cat), rnd)
    if (v && !usedVoices.has(v.voice)) {
      usedVoices.add(v.voice)
      picked.push({
        id: uuid(),
        name: v.name,
        voice: v.voice,
        volume: defaultVolumeForCategory(cat),
        steps: Array(stepCount).fill(false),
      })
    }
    if (picked.length >= count) break
  }

  // 2) Fill up with other categories
  while (picked.length < count) {
    const fillerCat = choose(FILLER_PREFS, rnd)
    let candidate = fillerCat ? choose(voicesForCategory(fillerCat), rnd) : undefined

    if (!candidate) {
      // fallback: pick from all
      const all = VOICE_CATALOG.flatMap((g) => g.voices)
      candidate = choose(all, rnd)
    }
    if (!candidate) break

    if (!usedVoices.has(candidate.voice)) {
      usedVoices.add(candidate.voice)
      const cat = categoryForVoice(candidate.voice)
      picked.push({
        id: uuid(),
        name: candidate.name,
        voice: candidate.voice,
        volume: defaultVolumeForCategory(cat),
        steps: Array(stepCount).fill(false),
      })
    }
  }

  return picked.slice(0, count)
}

export function fillBeats({
  tracks,
  stepCount,
  rnd = rngDefault,
}: {
  tracks: RandomTrack[]
  stepCount: number
  rnd?: RNG
}): RandomTrack[] {
  const downbeats = [0, 8]
  const backbeats = [4, 12]
  const evenSteps = Array.from({ length: stepCount }, (_, i) => i).filter((i) => i % 2 === 0)
  const offbeats = [2, 6, 10, 14]

  function clampDensity(steps: boolean[], cap: number) {
    const maxOn = Math.floor(stepCount * cap)
    const on = steps.reduce<number[]>((acc, v, i) => (v ? (acc.push(i), acc) : acc), [])
    while (on.length > maxOn) {
      const k = Math.floor(rnd() * on.length)
      const idx = on[k]
      steps[idx] = false
      on.splice(k, 1)
    }
  }

  function tryPlace(steps: boolean[], indexes: number[], chance = 1) {
    let placed = 0
    for (const i of indexes) {
      if (!steps[i] && rnd() < chance) {
        steps[i] = true
        placed++
      }
    }
    return placed
  }

  return tracks.map((t) => {
    const cat = categoryForVoice(t.voice)
    const cap = densityForCategory(cat)
    const steps = Array(stepCount).fill(false)

    switch (cat) {
      case "Kicks": {
        tryPlace(steps, downbeats, 1)
        tryPlace(steps, [4, 12], 0.5)
        tryPlace(steps, offbeats, 0.18)
        break
      }
      case "Snares": {
        tryPlace(steps, backbeats, 0.95)
        tryPlace(steps, [6, 10], 0.2)
        break
      }
      case "Hats": {
        tryPlace(steps, evenSteps, 0.55)
        tryPlace(steps, offbeats, 0.35)
        break
      }
      case "Bass": {
        tryPlace(steps, downbeats, 0.9)
        tryPlace(steps, [6, 10, 12, 14], 0.35)
        break
      }
      case "Percussion": {
        tryPlace(steps, [1, 3, 6, 9, 11, 13, 15], 0.35)
        break
      }
      case "Cymbals": {
        tryPlace(steps, [0], 0.8)
        tryPlace(steps, [8], 0.35)
        break
      }
      case "Lead": {
        tryPlace(steps, [2, 4, 6, 10, 12, 14], 0.3)
        tryPlace(steps, [1, 5, 9, 13], 0.25)
        break
      }
      case "Pad": {
        tryPlace(steps, [0, 4, 8, 12], 0.6)
        break
      }
      case "FX": {
        tryPlace(steps, [0, 15], 0.5)
        break
      }
      default: {
        tryPlace(steps, downbeats, 0.5)
        tryPlace(steps, backbeats, 0.4)
        tryPlace(steps, offbeats, 0.2)
      }
    }

    // light fill if too sparse
    for (let i = 0; i < stepCount; i++) {
      if (rnd() < 0.1) steps[i] ||= false
    }

    clampDensity(steps, cap)

    // ensure at least one hit
    if (!steps.some(Boolean)) {
      const candidates = [...downbeats, ...backbeats]
      steps[choose(candidates, rnd) ?? 0] = true
    }

    return { ...t, steps }
  })
}

export function generateRandomSession({
  stepCount,
  minTracks = 6,
  maxTracks = 10,
  rnd = rngDefault,
}: {
  stepCount: number
  minTracks?: number
  maxTracks?: number
  rnd?: RNG
}): RandomTrack[] {
  const tracks = buildRandomTracks({ stepCount, minTracks, maxTracks, rnd })
  return fillBeats({ tracks, stepCount, rnd })
}
