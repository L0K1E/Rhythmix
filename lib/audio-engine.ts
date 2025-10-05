import { triggerVoice, type VoiceName } from "./drum-voices"

type Sub = (currentStep: number) => void

class AudioEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null

  private isPlaying = false
  private tempo = 120
  private lookahead = 25 /* ms */
  private scheduleAhead = 0.1 /* s */
  private nextNoteTime = 0
  private currentStep = 0
  private stepSubdivision = 0.25 /* quarter note / 4 = 16 steps per bar */

  private timerID: number | null = null
  private subscribers: Set<Sub> = new Set()

  private ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      this.ctx = new AudioCtx()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0.8
      this.master.connect(this.ctx.destination)
    }
  }

  setTempo(bpm: number) {
    this.tempo = Math.max(40, Math.min(240, bpm))
  }

  setVolume(vol: number) {
    this.ensureContext()
    if (this.master) this.master.gain.value = Math.max(0, Math.min(1, vol))
  }

  subscribe(fn: Sub) {
    this.subscribers.add(fn)
    return () => this.subscribers.delete(fn)
  }

  private notify(step: number) {
    for (const fn of this.subscribers) fn(step)
  }

  private nextStepTime() {
    const secondsPerBeat = 60.0 / this.tempo
    this.nextNoteTime += this.stepSubdivision * secondsPerBeat
    this.currentStep = (this.currentStep + 1) % 16
    this.notify(this.currentStep)
  }

  private scheduler(callback: (time: number, step: number) => void) {
    if (!this.ctx) return
    while (this.ctx.currentTime + this.scheduleAhead >= this.nextNoteTime) {
      callback(this.nextNoteTime, this.currentStep)
      this.nextStepTime()
    }
    this.timerID = window.setTimeout(() => this.scheduler(callback), this.lookahead)
  }

  async start(callback: (time: number, step: number) => void) {
    this.ensureContext()
    if (!this.ctx || !this.master) return
    if (this.isPlaying) return
    await this.ctx.resume()
    this.isPlaying = true
    this.currentStep = 0
    this.nextNoteTime = this.ctx.currentTime + 0.05
    // Immediately notify so playhead syncs visually on play
    this.notify(this.currentStep)
    this.scheduler(callback)
  }

  stop() {
    if (!this.isPlaying) return
    this.isPlaying = false
    if (this.timerID) window.clearTimeout(this.timerID)
    this.timerID = null
  }

  trigger(name: VoiceName, time?: number, velocity = 1) {
    this.ensureContext()
    if (!this.ctx || !this.master) return
    triggerVoice(this.ctx, this.master, name, { time: time ?? this.ctx.currentTime, velocity })
  }

  // Allow transport scrubbing: jump to a specific step and reschedule
  seekToStep(step: number) {
    this.ensureContext()
    if (!this.ctx) return
    const n = ((step % 16) + 16) % 16
    this.currentStep = n
    this.nextNoteTime = this.ctx.currentTime + 0.05
    this.notify(this.currentStep)
  }
}

let engineSingleton: AudioEngine | null = null
export function getAudioEngine() {
  if (!engineSingleton) engineSingleton = new AudioEngine()
  return engineSingleton
}

export type { VoiceName }
