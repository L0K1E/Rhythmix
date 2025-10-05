"use client"
import { getAudioEngine } from "@/lib/audio-engine"
import type React from "react"
import { FileUp, FileDown, Trash2 } from "lucide-react" // Import FileUp, FileDown, Trash2

import type { SaveData } from "@/lib/persistence"
import { exportSequenceToWav } from "@/lib/export-audio"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Play, Pause, Volume2, Microscope as Metronome, Dice5 } from "lucide-react"

type Track = { name: string; voice: string; gain?: number }

type Props = {
  tempo: number
  setTempo: (n: number) => void
  volume: number
  setVolume: (n: number) => void
  pattern: boolean[][]
  setPattern: (p: boolean[][]) => void
  tracks: Track[]
  setTracks: (t: Track[]) => void
  onPlayStateChange: (playing: boolean) => void
  projectName?: string // use for filenames
}

export function Transport({
  tempo,
  setTempo,
  volume,
  setVolume,
  pattern,
  setPattern,
  tracks,
  setTracks,
  onPlayStateChange,
  projectName,
}: Props) {
  const engine = getAudioEngine()
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const unsub = engine.subscribe((step) => setPosition(step))
    return () => unsub()
  }, [engine])

  function togglePlay() {
    if (playing) {
      setPlaying(false)
      onPlayStateChange(false)
    } else {
      engine.setTempo(tempo)
      setPlaying(true)
      onPlayStateChange(true)
    }
  }

  useEffect(() => {
    engine.setTempo(tempo)
  }, [tempo, engine])

  useEffect(() => {
    engine.setVolume(volume)
  }, [volume, engine])

  function filenameBase() {
    const base = (projectName?.trim() || "Drum Machine").toLowerCase()
    return base.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
  }

  function onClear() {
    const cleared = pattern.map(() => Array(16).fill(false))
    setPattern(cleared)
  }

  function onScrub(val: number) {
    setPosition(val)
    engine.seekToStep(val)
  }

  async function onExportAudio() {
    const blob = await exportSequenceToWav({
      tracks: tracks.map((t, i) => ({ voice: t.voice as any, steps: pattern[i] || [], gain: (t as any).gain ?? 0.8 })), // include per-track gain
      tempoBpm: tempo,
      bars: 1,
    })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `${filenameBase() || "drum-machine"}.wav` //
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(a.href)
  }

  function onRandomize() {
    window.dispatchEvent(new CustomEvent("drum/randomize"))
  }

  function onImportJSONClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  function onImportJSON(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const data: SaveData = JSON.parse(content)
        setPattern(data.pattern)
        setTracks(data.tracks)
        setTempo(data.tempo)
        setVolume(data.volume)
      }
      reader.readAsText(file)
    }
  }

  function onExportJSON() {
    const saveData: SaveData = {
      pattern,
      tracks,
      tempo,
      volume,
    }
    const blob = new Blob([JSON.stringify(saveData)], { type: "application/json" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `${filenameBase() || "drum-machine"}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div
      className="flex flex-wrap items-center gap-3 rounded-lg border p-3"
      style={{ backgroundColor: "hsl(var(--color-toolbar-bg))", borderColor: "hsl(var(--color-toolbar-border))" }}
    >
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          className={cn(
            "h-10 w-10 rounded-full p-0",
            "bg-[hsl(var(--color-play-bg))] text-[hsl(var(--color-play-fg))] hover:opacity-90",
          )}
          aria-pressed={playing}
          onClick={togglePlay}
          title={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>

        <div className="flex items-center gap-2">
          <Slider value={[position]} min={0} max={15} step={1} onValueChange={([v]) => onScrub(v)} className="w-48" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Metronome className="h-4 w-4 text-muted-foreground" />
        <input
          aria-label="Tempo BPM"
          type="number"
          min={40}
          max={240}
          value={tempo}
          onChange={(e) => setTempo(Number(e.target.value))}
          className="w-20 rounded-md border bg-background px-2 py-1 text-sm"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider value={[volume]} min={0} max={1} step={0.01} onValueChange={([v]) => setVolume(v)} className="w-36" />
        </div>

        <Button
          variant="secondary"
          onClick={onImportJSONClick}
          className="inline-flex items-center gap-2"
          title="Import JSON"
        >
          <FileUp className="h-4 w-4" /> Import
        </Button>
        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={onImportJSON} />

        <Button variant="secondary" onClick={onExportJSON} className="inline-flex items-center gap-2" title="Save JSON">
          <FileDown className="h-4 w-4" /> Save
        </Button>

        <Button
          variant="secondary"
          onClick={onRandomize}
          className="inline-flex items-center gap-2"
          title="Generate a musically weighted pattern"
        >
          <Dice5 className="h-4 w-4" /> Randomize
        </Button>

        <Button variant="destructive" onClick={onClear} className="inline-flex items-center gap-2">
          <Trash2 className="h-4 w-4" /> Clear
        </Button>
      </div>
    </div>
  )
}
