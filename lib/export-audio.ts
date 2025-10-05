import type { VoiceName } from "./drum-voices"
import { triggerVoice } from "./drum-voices"

// naive WAV encoder from AudioBuffer
function encodeWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels
  const sampleRate = buffer.sampleRate
  const length = buffer.length * numChannels * 2 + 44
  const arrayBuffer = new ArrayBuffer(length)
  const view = new DataView(arrayBuffer)

  // Write WAV header
  function writeStr(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
  }
  let offset = 0
  writeStr(offset, "RIFF")
  offset += 4
  view.setUint32(offset, length - 8, true)
  offset += 4
  writeStr(offset, "WAVE")
  offset += 4
  writeStr(offset, "fmt ")
  offset += 4
  view.setUint32(offset, 16, true)
  offset += 4 // PCM
  view.setUint16(offset, 1, true)
  offset += 2 // linear PCM
  view.setUint16(offset, numChannels, true)
  offset += 2
  view.setUint32(offset, sampleRate, true)
  offset += 4
  const bytesPerSample = 2
  const blockAlign = numChannels * bytesPerSample
  view.setUint32(offset, sampleRate * blockAlign, true)
  offset += 4
  view.setUint16(offset, blockAlign, true)
  offset += 2
  view.setUint16(offset, 8 * bytesPerSample, true)
  offset += 2
  writeStr(offset, "data")
  offset += 4
  view.setUint32(offset, buffer.length * blockAlign, true)
  offset += 4

  // Interleave and write PCM
  const channels: Float32Array[] = []
  for (let i = 0; i < numChannels; i++) channels.push(buffer.getChannelData(i))
  let idx = 0
  while (idx < buffer.length) {
    for (let c = 0; c < numChannels; c++) {
      let sample = channels[c][idx]
      sample = Math.max(-1, Math.min(1, sample))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
      offset += 2
    }
    idx++
  }
  return new Blob([arrayBuffer], { type: "audio/wav" })
}

export type ExportTrack = {
  voice: VoiceName
  steps: boolean[] // 16-step pattern assumed
  gain?: number
}

export async function exportSequenceToWav({
  tracks,
  tempoBpm,
  bars = 1,
  sampleRate = 48000,
}: {
  tracks: ExportTrack[]
  tempoBpm: number
  bars?: number
  sampleRate?: number
}): Promise<Blob> {
  const stepsPerBar = 16
  const totalSteps = stepsPerBar * bars
  const secondsPerBeat = 60 / tempoBpm
  const secondsPerStep = secondsPerBeat / 4 // 16 steps per 4 beats

  const duration = totalSteps * secondsPerStep + 1 // tail
  const ctx = new OfflineAudioContext(2, Math.ceil(duration * sampleRate), sampleRate)
  const master = ctx.createGain()
  master.gain.value = 1
  master.connect(ctx.destination)

  tracks.forEach((track) => {
    track.steps.forEach((on, idx) => {
      if (!on) return
      const when = idx * secondsPerStep
      // cast ctx to any to reuse the same synths (compatible API with OfflineAudioContext)
      triggerVoice(ctx as any, master as any, track.voice, { time: when, velocity: track.gain ?? 0.8 })
    })
  })

  const rendered = await ctx.startRendering()
  return encodeWav(rendered)
}
