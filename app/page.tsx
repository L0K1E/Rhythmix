"use client"
import { useEffect, useState } from "react"
import { Sequencer } from "@/components/drum/sequencer"
import { Transport } from "@/components/drum/transport"
import { loadState, saveState } from "@/lib/persistence"
import type { VoiceName } from "@/lib/audio-engine"

type Track = { name: string; voice: VoiceName; gain?: number }

const DEFAULT_TRACKS: Track[] = [
  { name: "Kick", voice: "kick", gain: 1 },
  { name: "Snare", voice: "snare", gain: 1 },
  { name: "CHat", voice: "hihat", gain: 1 },
  { name: "OHat", voice: "openhat", gain: 1 },
  { name: "Clap", voice: "clap", gain: 1 },
  { name: "Tom", voice: "tom", gain: 1 },
  { name: "Perc", voice: "perc1", gain: 1 },
  { name: "Shkr", voice: "shaker", gain: 1 },
]

export default function Page() {
  const [tracks, setTracks] = useState<Track[]>(DEFAULT_TRACKS)
  const [projectName, setProjectName] = useState("Drum Machine")
  const [editingName, setEditingName] = useState(false)
  const [pattern, setPattern] = useState<boolean[][]>(() =>
    Array.from({ length: DEFAULT_TRACKS.length }, () => Array(16).fill(false)),
  )
  const [tempo, setTempo] = useState(120)
  const [volume, setVolume] = useState(0.8)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const s = loadState()
    if (s?.pattern) {
      setPattern(s.pattern)
      if (Array.isArray(s.tracks) && s.tracks.length) {
        setTracks(s.tracks as Track[])
      } else {
        setPattern((prev) => {
          if (prev.length === DEFAULT_TRACKS.length) return prev
          const rows = Math.max(prev.length, DEFAULT_TRACKS.length)
          return Array.from({ length: rows }, (_, i) => prev[i] ?? Array(16).fill(false))
        })
      }
    }
    if (typeof s?.tempo === "number") setTempo(s.tempo)
    if (typeof s?.volume === "number") setVolume(s.volume)
  }, [])

  useEffect(() => {
    saveState({ pattern, tempo, volume, tracks })
  }, [pattern, tempo, volume, tracks])

  useEffect(() => {
    setPattern((prev) => {
      if (prev.length === tracks.length) return prev
      const max = Math.max(prev.length, tracks.length)
      const next = Array.from({ length: max }, (_, i) => prev[i] ?? Array(16).fill(false))
      return next.slice(0, tracks.length)
    })
  }, [tracks])

  return (
    <main className="mx-auto max-w-6xl p-4">
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {editingName ? (
            <input
              autoFocus
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") setEditingName(false)
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-lg font-semibold"
              aria-label="Project name"
            />
          ) : (
            <h1
              className="text-pretty text-2xl font-semibold"
              onDoubleClick={() => setEditingName(true)}
              title="Double-click to rename project"
            >
              {projectName || "Drum Machine"}
              <span className="ml-2 rounded-md bg-accent px-2 py-0.5 text-xs text-accent-foreground">16-step</span>
            </h1>
          )}
        </div>
      </header>

      <section aria-label="Sequencer and Controls" className="flex flex-col gap-3 rounded-lg">
        <Transport
          tempo={tempo}
          setTempo={setTempo}
          volume={volume}
          setVolume={setVolume}
          pattern={pattern}
          setPattern={setPattern}
          tracks={tracks}
          setTracks={setTracks}
          onPlayStateChange={setPlaying}
          projectName={projectName || "Drum Machine"}
        />
        <Sequencer
          tracks={tracks}
          setTracks={setTracks}
          pattern={pattern}
          setPattern={setPattern}
          tempo={tempo}
          playing={playing}
        />
      </section>

      <footer className="mt-6 text-center text-xs text-muted-foreground">
        Build patterns in the timeline and produce music.
      </footer>
    </main>
  )
}
