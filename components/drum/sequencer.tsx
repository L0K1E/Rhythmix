"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import { getAudioEngine, type VoiceName } from "@/lib/audio-engine"
import { cn } from "@/lib/utils"
import { VOICE_CATALOG, getCategoryForVoice, CATEGORY_COLORS } from "@/lib/voice-catalog"
import { Plus, Search, MoreVertical } from "lucide-react"
import { generateRandomSession } from "@/lib/randomizer"
import { Slider } from "@/components/ui/slider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

type Track = { name: string; voice: VoiceName; gain?: number }

type Props = {
  tracks: Track[]
  setTracks: (t: Track[]) => void
  pattern: boolean[][]
  setPattern: (p: boolean[][]) => void
  tempo: number
  playing: boolean
}

export function Sequencer({ tracks, setTracks, pattern, setPattern, tempo, playing }: Props) {
  const engine = getAudioEngine()
  const [playhead, setPlayhead] = useState(0)
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("All")
  const patternRef = useRef(pattern)

  useEffect(() => {
    patternRef.current = pattern
  }, [pattern])

  useEffect(() => {
    const unsub = engine.subscribe((step) => setPlayhead(step))
    return () => unsub()
  }, [engine])

  useEffect(() => {
    engine.setTempo(tempo)
  }, [tempo, engine])

  useEffect(() => {
    if (playing) {
      engine.start((time, step) => {
        const p = patternRef.current
        for (let row = 0; row < tracks.length; row++) {
          if (p[row]?.[step]) {
            const vel = Math.max(0, Math.min(1, tracks[row]?.gain ?? 0.8)) // per-track volume → velocity
            engine.trigger(tracks[row].voice, time, vel)
          }
        }
      })
    } else {
      engine.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, tracks.length])

  function toggleCell(row: number, col: number) {
    const next = pattern.map((r) => r.slice())
    const wasOn = next[row][col]
    next[row][col] = !next[row][col]
    setPattern(next)

    if (!wasOn) {
      // play a short preview without affecting transport
      const vel = Math.max(0, Math.min(1, tracks[row]?.gain ?? 0.8))
      getAudioEngine().trigger(tracks[row].voice, undefined, vel)
    }
  }

  function clearRow(row: number) {
    const next = pattern.map((r, idx) => (idx === row ? Array(16).fill(false) : r.slice()))
    setPattern(next)
  }

  function addTrack(t: Track) {
    setTracks([...tracks, { ...t, gain: 1 }]) // default gain
    setPattern([...pattern, Array(16).fill(false)])
    setShowAdd(false)
  }

  function removeRow(row: number) {
    const nextTracks = tracks.slice()
    nextTracks.splice(row, 1)
    const nextPattern = pattern.slice()
    nextPattern.splice(row, 1)
    setTracks(nextTracks)
    setPattern(nextPattern)
  }

  function setRowGain(row: number, gain: number) {
    const next = tracks.map((t, i) => (i === row ? { ...t, gain } : t))
    setTracks(next)
  }

  const MAX_DENSITY = 0.5 // ~50% max fill per track
  const STEPS = 16

  function clampDensity(steps: boolean[]) {
    const maxOn = Math.floor(STEPS * MAX_DENSITY)
    const onIdx = steps.reduce<number[]>((acc, v, i) => (v ? (acc.push(i), acc) : acc), [])
    while (onIdx.length > maxOn) {
      const k = Math.floor(Math.random() * onIdx.length)
      const idx = onIdx[k]
      steps[idx] = false
      onIdx.splice(k, 1)
    }
  }

  function weightsForCategory(cat: string): number[] {
    // 16 steps pattern weighting by category
    const w = new Array(STEPS).fill(0.05) // low base noise to avoid silence
    // downbeats and backbeats
    const downbeats = [0, 8]
    const backbeats = [4, 12]
    const sixteenthsEven = Array.from({ length: STEPS }, (_, i) => i).filter((i) => i % 2 === 0)
    const offbeats = [2, 6, 10, 14]

    switch (cat) {
      case "Kicks": {
        for (const i of downbeats) w[i] = 0.95
        for (const i of [4, 12]) w[i] = Math.max(w[i], 0.35)
        for (const i of [2, 6, 10, 14]) w[i] = Math.max(w[i], 0.18)
        break
      }
      case "Snares": {
        for (const i of backbeats) w[i] = 0.9
        for (const i of [6, 10]) w[i] = Math.max(w[i], 0.18)
        break
      }
      case "Hats": {
        for (const i of sixteenthsEven) w[i] = 0.55
        for (const i of offbeats) w[i] = Math.max(w[i], 0.7)
        w[0] = Math.max(w[0], 0.35)
        break
      }
      case "Percussion": {
        for (const i of offbeats) w[i] = Math.max(w[i], 0.35)
        for (const i of [3, 7, 11, 15]) w[i] = Math.max(w[i], 0.25)
        break
      }
      case "Cymbals": {
        w[0] = 0.8 // crash on bar start
        for (const i of [8]) w[i] = Math.max(w[i], 0.35)
        break
      }
      case "Bass": {
        for (const i of downbeats) w[i] = 0.7
        for (const i of [6, 10, 12, 14]) w[i] = Math.max(w[i], 0.35)
        break
      }
      case "Lead": {
        for (const i of [2, 4, 6, 10, 12, 14]) w[i] = Math.max(w[i], 0.35)
        for (const i of [1, 5, 9, 13]) w[i] = Math.max(w[i], 0.25)
        break
      }
      case "Pad": {
        for (const i of [0, 4, 8, 12]) w[i] = 0.6
        break
      }
      case "FX": {
        for (const i of [0, 15]) w[i] = Math.max(w[i], 0.5)
        break
      }
      default: {
        // reasonable general groove
        for (const i of downbeats) w[i] = Math.max(w[i], 0.5)
        for (const i of backbeats) w[i] = Math.max(w[i], 0.4)
        for (const i of offbeats) w[i] = Math.max(w[i], 0.2)
      }
    }
    return w
  }

  const randomizePattern = useCallback(() => {
    const next: boolean[][] = tracks.map((t) => {
      const cat = getCategoryForVoice(t.voice)
      const weights = weightsForCategory(cat)
      const row = new Array(STEPS).fill(false).map((_, i) => Math.random() < weights[i])
      clampDensity(row)
      // ensure at least a hit for very sparse categories
      if (!row.some(Boolean)) {
        const candidates = weights
          .map((p, i) => ({ i, p }))
          .sort((a, b) => b.p - a.p)
          .slice(0, 4)
        const pick = candidates[Math.floor(Math.random() * candidates.length)]?.i ?? 0
        row[pick] = true
      }
      return row
    })

    setPattern(next)
  }, [tracks, setPattern])

  useEffect(() => {
    const onRand = () => {
      // Build a fresh session: remove all tracks, add 6–10 new ones with volumes, and place beats
      const session = generateRandomSession({ stepCount: 16, minTracks: 6, maxTracks: 10 })
      const newTracks = session.map((s) => ({ name: s.name, voice: s.voice as VoiceName, gain: s.volume }))
      const newPattern = session.map((s) => s.steps)
      setTracks(newTracks)
      setPattern(newPattern)
    }
    window.addEventListener("drum/randomize", onRand)
    return () => window.removeEventListener("drum/randomize", onRand)
  }, [setTracks, setPattern])

  const categories = ["All", ...VOICE_CATALOG.map((c) => c.category)]

  return (
    <div className="rounded-lg border border-border bg-card/50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs text-muted-foreground" />
      </div>
      <div className="grid grid-cols-[140px_1fr] gap-2">
        <div />
        <div className="grid grid-cols-16 gap-1">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={`col-head-${i}`}
              className={cn(
                "h-5 rounded-sm text-center text-[10px] leading-5 text-muted-foreground",
                i % 4 === 0 && "bg-muted/40",
                playhead === i && "bg-accent/20 text-foreground",
              )}
            >
              {(i + 1).toString().padStart(2, "0")}
            </div>
          ))}
        </div>

        {tracks.map((t, row) => (
          <FragmentRow
            key={`${t.name}-${row}`}
            name={t.name}
            row={row}
            playhead={playhead}
            pattern={pattern}
            onToggle={toggleCell}
            onClear={clearRow}
            onRemove={removeRow} // pass remove handler
            onGainChange={setRowGain} // pass gain handler
            voice={t.voice}
            gain={t.gain ?? 1}
          />
        ))}
      </div>

      <div className="mt-3 flex justify-end">
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/30 px-3 py-2 text-sm hover:bg-secondary/50"
        >
          <Plus className="h-4 w-4" /> Add Track
        </button>
      </div>

      {showAdd && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-background/70" onClick={() => setShowAdd(false)} />
          <div className="relative z-10 w-[min(640px,90vw)] rounded-lg border border-border bg-card p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tracks..."
                  className="w-56 rounded-md border border-border bg-background px-2 py-1 text-sm"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-md border border-border bg-background px-2 py-1 text-sm"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setShowAdd(false)}
                className="rounded-md border border-border bg-secondary/30 px-2 py-1 text-sm hover:bg-secondary/50"
              >
                Close
              </button>
            </div>

            <div className="max-h-[50vh] overflow-auto rounded-md border border-border">
              {VOICE_CATALOG.filter((cat) => category === "All" || cat.category === category).map((cat) => {
                const filtered = cat.voices.filter((v) =>
                  `${v.name} ${v.voice}`.toLowerCase().includes(search.toLowerCase()),
                )
                if (!filtered.length) return null
                return (
                  <div key={cat.category} className="border-b border-border last:border-0">
                    <div className="bg-muted/30 px-3 py-2 text-xs text-muted-foreground">{cat.category}</div>
                    <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2">
                      {filtered.map((v) => (
                        <div
                          key={v.voice}
                          className="flex items-center justify-between rounded-md border border-border bg-secondary/20 p-2"
                        >
                            <div className="text-sm font-medium">{v.name}</div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => getAudioEngine().trigger(v.voice, undefined, 1)}
                              className="rounded-md border border-border px-2 py-1 text-xs hover:bg-secondary/40"
                            >
                              Preview
                            </button>
                            <button
                              onClick={() => addTrack({ name: v.name, voice: v.voice })}
                              className="rounded-md bg-accent px-2 py-1 text-xs text-accent-foreground hover:bg-accent/90"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FragmentRow({
  name,
  row,
  playhead,
  pattern,
  onToggle,
  onClear,
  onRemove,
  onGainChange,
  voice,
  gain,
}: {
  name: string
  row: number
  playhead: number
  pattern: boolean[][]
  onToggle: (row: number, col: number) => void
  onClear: (row: number) => void
  onRemove: (row: number) => void
  onGainChange: (row: number, gain: number) => void
  voice: VoiceName
  gain: number
}) {
  const category = getCategoryForVoice(voice)
  const color = CATEGORY_COLORS[category]

  return (
    <>
      <div className="flex items-center justify-between pr-2 text-sm text-muted-foreground">
        <span className="truncate">{name}</span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label={`Track options for ${name}`}
              className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded border border-border text-muted-foreground hover:bg-secondary/40"
              title="Track options"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Track Options</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onClear(row)} title="Remove all steps in this track">
              Clear Beats
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRemove(row)} title="Delete this track">
              Remove Track
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span>Volume</span>
                <span>{Math.round((gain ?? 1) * 100)}%</span>
              </div>
              <Slider
                value={[gain ?? 1]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={([v]) => onGainChange(row, v)}
                className="w-full"
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-16 gap-1">
        {Array.from({ length: 16 }).map((_, col) => {
          const active = pattern[row]?.[col]
          const isBeat = col % 4 === 0
          const isNow = playhead === col
          const style = active
            ? {
                background: color,
                color: "hsl(var(--color-play-fg))",
                boxShadow: `0 0 0.25rem ${color}, 0 0 0.5rem ${color}66`,
              }
            : undefined
          return (
            <button
              key={`${row}-${col}`}
              onClick={() => onToggle(row, col)}
              aria-pressed={!!active}
              className={cn(
                "h-7 rounded-sm border transition-colors",
                isNow ? "border-accent" : "border-[hsl(var(--color-step-border))]",
                !active && (isBeat ? "bg-secondary/30" : "bg-secondary/20"),
                !active && "hover:bg-secondary/40",
              )}
              style={style}
            />
          )
        })}
      </div>
    </>
  )
}
