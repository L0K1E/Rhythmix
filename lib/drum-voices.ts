// Replace VoiceName with the expanded union
export type VoiceName =
  | "kick"
  | "subkick"
  | "808_kick"
  | "909_kick"
  | "acoustic_kick"
  | "electronic_kick"
  | "snare"
  | "snare_acoustic"
  | "snare_elec"
  | "snare_snap"
  | "snare_muted"
  | "cross_stick"
  | "side_stick"
  | "hihat"
  | "closedhat"
  | "openhat"
  | "pedal_hat"
  | "loose_hat"
  | "sizzle"
  | "bell_hat"
  | "ride"
  | "ride_bell"
  | "ride_edge"
  | "splash"
  | "china"
  | "splash_small"
  | "crash"
  | "reverse_crash"
  | "swell"
  | "tom"
  | "tom_high"
  | "tom_mid"
  | "tom_low"
  | "floor_tom"
  | "perc1"
  | "perc2"
  | "perc3"
  | "tambourine"
  | "maracas"
  | "shaker"
  | "cabasa"
  | "guiro"
  | "temple_block"
  | "handclap_close"
  | "handclap_room"
  | "snap"
  | "finger_snap"
  | "stomp"
  | "clap_body"
  | "rim"
  | "rimshot"
  | "rim_click"
  | "stick_click"
  | "cowbell"
  | "clave"
  | "bongo"
  | "bongo_hi"
  | "bongo_lo"
  | "conga"
  | "conga_high"
  | "conga_low"
  | "djembe"
  | "cajon"
  | "darbuka"
  | "timbale"
  | "agogo"
  | "udu"
  | "tabla"
  | "bell"
  | "tubular_bell"
  | "belltone"
  | "marimba"
  | "vibraphone"
  | "glockenspiel"
  | "kalimba"
  | "click"
  | "pulse"
  | "glitch"
  | "clicky"
  | "bitcrush"
  | "tape_pop"
  | "vinyl_pop"
  | "vinyl_scratch"
  | "riser"
  | "impact"
  | "sweep"
  | "metallic_hit"
  | "glitch_fx"
  | "bass_sine"
  | "lead_saw"
  | "pad_tri"
  | "pluck_fm"
  | "fx_bleep"
  | "tamb" // short for tambourine
  | "bitcrush_hit" // alias to bitcrush
  | "throat_hit" // body/foley
  | "bongos_var" // bongo variant

// Add metadata for voices (subset explicit, others inherit via category)
export type VoiceCategory =
  | "Kicks"
  | "Snares"
  | "Hats"
  | "Percussion"
  | "Cymbals/Fx"
  | "World"
  | "Electronic/Glitch"
  | "Melodic"
  | "Flesh/Body"

export type VoiceMeta = {
  name: VoiceName
  displayName: string
  category: VoiceCategory
  color?: string // optional; UI should fallback to category color map
  chokeGroup?: string
  articulations?: string[]
  sample?: boolean // true=sample, false/undefined=synth
  monophonic?: boolean
  defaultTune?: number
  velocityZones?: Array<{ vMin: number; vMax: number; sample?: string }>
}

// Simple aliasing from extended names -> base synth we support
const BASE_ALIAS: Partial<
  Record<
    VoiceName,
    | "kick"
    | "snare"
    | "hihat"
    | "openhat"
    | "clap"
    | "tom"
    | "perc1"
    | "perc2"
    | "rim"
    | "cowbell"
    | "shaker"
    | "ride"
    | "crash"
    | "clave"
    | "bongo"
    | "conga"
    | "bass_sine"
    | "lead_saw"
    | "pad_tri"
    | "pluck_fm"
    | "fx_bleep"
  >
> = {
  subkick: "kick",
  "808_kick": "kick",
  "909_kick": "kick",
  acoustic_kick: "kick",
  electronic_kick: "kick",

  snare_acoustic: "snare",
  snare_elec: "snare",
  snare_snap: "snare",
  snare_muted: "snare",
  cross_stick: "rim",
  side_stick: "rim",

  closedhat: "hihat",
  pedal_hat: "hihat",
  loose_hat: "hihat",
  sizzle: "hihat",
  bell_hat: "hihat",

  ride_bell: "ride",
  ride_edge: "ride",
  splash: "crash",
  china: "crash",
  splash_small: "crash",
  reverse_crash: "crash",
  swell: "crash",

  tom_high: "tom",
  tom_mid: "tom",
  tom_low: "tom",
  floor_tom: "tom",

  perc3: "perc2",
  tambourine: "shaker",
  maracas: "shaker",
  cabasa: "shaker",
  guiro: "perc2",
  temple_block: "perc2",

  handclap_close: "clap",
  handclap_room: "clap",
  snap: "clap",
  finger_snap: "clap",
  stomp: "clap",
  clap_body: "clap",

  rimshot: "rim",
  rim_click: "rim",
  stick_click: "rim",

  bongo_hi: "bongo",
  bongo_lo: "bongo",
  conga_high: "conga",
  conga_low: "conga",

  djembe: "perc2",
  cajon: "perc2",
  darbuka: "perc2",
  timbale: "perc2",
  agogo: "perc2",
  udu: "perc2",
  tabla: "perc2",

  bell: "ride",
  tubular_bell: "ride",
  belltone: "ride",
  marimba: "perc2",
  vibraphone: "perc2",
  glockenspiel: "perc2",
  kalimba: "perc2",

  click: "rim",
  pulse: "perc2",
  glitch: "perc2",
  clicky: "perc2",
  bitcrush: "perc2",
  tape_pop: "perc2",
  vinyl_pop: "perc2",
  vinyl_scratch: "perc2",

  riser: "crash",
  impact: "crash",
  sweep: "crash",
  metallic_hit: "cowbell",
  glitch_fx: "perc2",

  bass_sine: "bass_sine",
  lead_saw: "lead_saw",
  pad_tri: "pad_tri",
  pluck_fm: "pluck_fm",
  fx_bleep: "fx_bleep",

  tamb: "shaker",
  bitcrush_hit: "perc2", // gritty percussive synth (bitcrush-like)
  throat_hit: "rim", // short percussive click
  bongos_var: "bongo",
}

// Minimal metadata (you can enrich later)
export const VOICE_META: Record<VoiceName, VoiceMeta> = {
  // Kicks
  kick: { name: "kick", displayName: "Kick", category: "Kicks", monophonic: true },
  subkick: { name: "subkick", displayName: "Sub Kick", category: "Kicks", monophonic: true, sample: false },
  "808_kick": { name: "808_kick", displayName: "808 Kick", category: "Kicks", monophonic: true },
  "909_kick": { name: "909_kick", displayName: "909 Kick", category: "Kicks", monophonic: true },
  acoustic_kick: { name: "acoustic_kick", displayName: "Acoustic Kick", category: "Kicks", monophonic: true },
  electronic_kick: { name: "electronic_kick", displayName: "Electronic Kick", category: "Kicks", monophonic: true },

  // Snares
  snare: { name: "snare", displayName: "Snare", category: "Snares" },
  snare_acoustic: { name: "snare_acoustic", displayName: "Snare Acoustic", category: "Snares" },
  snare_elec: { name: "snare_elec", displayName: "Snare Electronic", category: "Snares" },
  snare_snap: { name: "snare_snap", displayName: "Snare Snap", category: "Snares" },
  snare_muted: { name: "snare_muted", displayName: "Snare Muted", category: "Snares" },
  cross_stick: { name: "cross_stick", displayName: "Cross Stick", category: "Snares" },
  side_stick: { name: "side_stick", displayName: "Side Stick", category: "Snares" },
  clap: { name: "clap", displayName: "Clap", category: "Snares" },

  // Hats
  hihat: { name: "hihat", displayName: "Closed Hat", category: "Hats", chokeGroup: "hat", monophonic: true },
  closedhat: { name: "closedhat", displayName: "Closed Hat", category: "Hats", chokeGroup: "hat", monophonic: true },
  openhat: { name: "openhat", displayName: "Open Hat", category: "Hats", chokeGroup: "hat", monophonic: true },
  pedal_hat: { name: "pedal_hat", displayName: "Pedal Hat", category: "Hats", chokeGroup: "hat", monophonic: true },
  loose_hat: { name: "loose_hat", displayName: "Loose Hat", category: "Hats", chokeGroup: "hat", monophonic: true },
  sizzle: { name: "sizzle", displayName: "Sizzle Hat", category: "Hats", chokeGroup: "hat", monophonic: true },
  bell_hat: { name: "bell_hat", displayName: "Bell Hat", category: "Hats", chokeGroup: "hat", monophonic: true },

  // Cymbals / FX
  ride: { name: "ride", displayName: "Ride", category: "Cymbals/Fx" },
  ride_bell: { name: "ride_bell", displayName: "Ride Bell", category: "Cymbals/Fx" },
  ride_edge: { name: "ride_edge", displayName: "Ride Edge", category: "Cymbals/Fx" },
  splash: { name: "splash", displayName: "Splash", category: "Cymbals/Fx" },
  china: { name: "china", displayName: "China", category: "Cymbals/Fx" },
  splash_small: { name: "splash_small", displayName: "Small Splash", category: "Cymbals/Fx" },
  crash: { name: "crash", displayName: "Crash", category: "Cymbals/Fx" },
  reverse_crash: { name: "reverse_crash", displayName: "Reverse Crash", category: "Cymbals/Fx" },
  swell: { name: "swell", displayName: "Swell", category: "Cymbals/Fx" },

  // Toms & Percussion
  tom: { name: "tom", displayName: "Tom", category: "Percussion" },
  tom_high: { name: "tom_high", displayName: "Tom High", category: "Percussion" },
  tom_mid: { name: "tom_mid", displayName: "Tom Mid", category: "Percussion" },
  tom_low: { name: "tom_low", displayName: "Tom Low", category: "Percussion" },
  floor_tom: { name: "floor_tom", displayName: "Floor Tom", category: "Percussion" },

  perc1: { name: "perc1", displayName: "Perc 1", category: "Percussion" },
  perc2: { name: "perc2", displayName: "Perc 2", category: "Percussion" },
  perc3: { name: "perc3", displayName: "Perc 3", category: "Percussion" },

  tambourine: { name: "tambourine", displayName: "Tambourine", category: "Percussion" },
  maracas: { name: "maracas", displayName: "Maracas", category: "Percussion" },
  shaker: { name: "shaker", displayName: "Shaker", category: "Percussion" },
  cabasa: { name: "cabasa", displayName: "Cabasa", category: "Percussion" },
  guiro: { name: "guiro", displayName: "Guiro", category: "Percussion" },
  temple_block: { name: "temple_block", displayName: "Temple Block", category: "Percussion" },
  handclap_close: { name: "handclap_close", displayName: "Hand Clap Close", category: "Percussion" },
  handclap_room: { name: "handclap_room", displayName: "Hand Clap Room", category: "Percussion" },
  snap: { name: "snap", displayName: "Snap", category: "Percussion" },
  finger_snap: { name: "finger_snap", displayName: "Finger Snap", category: "Percussion" },
  stomp: { name: "stomp", displayName: "Stomp", category: "Percussion" },
  clap_body: { name: "clap_body", displayName: "Clap Body", category: "Percussion" },

  // Rims & Cymbals
  rim: { name: "rim", displayName: "Rim", category: "Cymbals/Fx" },
  rimshot: { name: "rimshot", displayName: "Rimshot", category: "Cymbals/Fx" },
  rim_click: { name: "rim_click", displayName: "Rim Click", category: "Cymbals/Fx" },
  stick_click: { name: "stick_click", displayName: "Stick Click", category: "Cymbals/Fx" },
  cowbell: { name: "cowbell", displayName: "Cowbell", category: "Cymbals/Fx" },
  clave: { name: "clave", displayName: "Clave", category: "Cymbals/Fx" },

  // World Percussion
  bongo: { name: "bongo", displayName: "Bongo", category: "World" },
  bongo_hi: { name: "bongo_hi", displayName: "Bongo High", category: "World" },
  bongo_lo: { name: "bongo_lo", displayName: "Bongo Low", category: "World" },
  conga: { name: "conga", displayName: "Conga", category: "World" },
  conga_high: { name: "conga_high", displayName: "Conga High", category: "World" },
  conga_low: { name: "conga_low", displayName: "Conga Low", category: "World" },
  djembe: { name: "djembe", displayName: "Djembe", category: "World" },
  cajon: { name: "cajon", displayName: "Cajon", category: "World" },
  darbuka: { name: "darbuka", displayName: "Darbuka", category: "World" },
  timbale: { name: "timbale", displayName: "Timbale", category: "World" },
  agogo: { name: "agogo", displayName: "Agogo", category: "World" },
  udu: { name: "udu", displayName: "Udu", category: "World" },
  tabla: { name: "tabla", displayName: "Tabla", category: "World" },
  bongos_var: { name: "bongos_var", displayName: "Bongos (Var)", category: "World" },

  // Shakers & Small Percussion
  tamb: { name: "tamb", displayName: "Tamb", category: "Percussion" },

  // Claps & Fingers (already present: snap, finger_snap, handclap_close, handclap_room)

  // Metallic/Bell-like (already present: bell, tubular_bell, agogo, metallic_hit)

  // Electronic/Glitch/FX (already present: click, pulse, glitch, clicky, bitcrush, tape_pop, vinyl_scratch, riser, impact, sweep, reverse_crash, swell)
  bitcrush_hit: { name: "bitcrush_hit", displayName: "Bitcrush Hit", category: "Electronic/Glitch" },

  // Foley / Human / Body Sounds (already present: stomp, clap_body, finger_snap)
  throat_hit: { name: "throat_hit", displayName: "Throat Hit", category: "Flesh/Body" },

  // Tuned / Melodic Percussion (already present: marimba, vibraphone, glockenspiel, kalimba)
}

export function triggerVoice(
  ctx: AudioContext | OfflineAudioContext,
  master: GainNode,
  name: VoiceName,
  opts: { time?: number; velocity?: number } = {},
) {
  const time = opts.time ?? (ctx as AudioContext).currentTime ?? 0
  const velocity = Math.max(0, Math.min(1, opts.velocity ?? 1))

  // Resolve to a supported base voice using the alias map if available
  const base = (typeof (BASE_ALIAS as any)?.[name] !== "undefined" ? (BASE_ALIAS as any)[name] : name) as
    | "kick"
    | "snare"
    | "hihat"
    | "openhat"
    | "clap"
    | "tom"
    | "perc1"
    | "perc2"
    | "rim"
    | "cowbell"
    | "shaker"
    | "ride"
    | "crash"
    | "clave"
    | "bongo"
    | "conga"
    | "bass_sine"
    | "lead_saw"
    | "pad_tri"
    | "pluck_fm"
    | "fx_bleep"

  switch (base) {
    case "kick":
      return synthKick(ctx, master, time, velocity)
    case "snare":
      return synthSnare(ctx, master, time, velocity)
    case "hihat":
      return synthHiHat(ctx, master, time, velocity, false)
    case "openhat":
      return synthHiHat(ctx, master, time, velocity, true)
    case "clap":
      return synthClap(ctx, master, time, velocity)
    case "tom":
      return synthTom(ctx, master, time, velocity, 200)
    case "bongo":
      return synthTom(ctx, master, time, velocity, 500)
    case "conga":
      return synthTom(ctx, master, time, velocity, 320)
    case "perc1":
      return synthTom(ctx, master, time, velocity, 420)
    case "perc2":
      return synthTom(ctx, master, time, velocity, 280)
    case "rim":
      return synthRim(ctx, master, time, velocity)
    case "cowbell":
      return synthCowbell(ctx, master, time, velocity)
    case "shaker":
      return synthShaker(ctx, master, time, velocity)
    case "ride":
      return synthRide(ctx, master, time, velocity)
    case "crash":
      return synthCrash(ctx, master, time, velocity)
    case "clave":
      return synthClave(ctx, master, time, velocity)
    case "bass_sine":
      return synthBassSine(ctx, master, time, velocity)
    case "lead_saw":
      return synthLeadSaw(ctx, master, time, velocity)
    case "pad_tri":
      return synthPadTri(ctx, master, time, velocity)
    case "pluck_fm":
      return synthPluckFM(ctx, master, time, velocity)
    case "fx_bleep":
      return synthBleep(ctx, master, time, velocity)
    default:
      // Fallback to a short click so unknown voices still make sound
      return synthRim(ctx, master, time, velocity)
  }
}

// Helpers

function connectGain(ctx: BaseAudioContext, master: GainNode, gain: number) {
  const g = ctx.createGain()
  g.gain.value = gain
  g.connect(master)
  return g
}

function createNoiseBuffer(ctx: BaseAudioContext) {
  const length = Math.max(1, Math.floor(ctx.sampleRate * 1.0))
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1
  return buffer
}

function synthKick(ctx: BaseAudioContext, master: GainNode, t: number, v: number) {
  const osc = ctx.createOscillator()
  const g = connectGain(ctx, master, 0.0)
  const env = g.gain
  osc.type = "sine"
  osc.frequency.setValueAtTime(150, t)
  osc.frequency.exponentialRampToValueAtTime(50, t + 0.15)
  env.setValueAtTime(0, t)
  env.linearRampToValueAtTime(0.9 * v, t + 0.001)
  env.exponentialRampToValueAtTime(0.0001, t + 0.2)
  osc.connect(g)
  osc.start(t)
  osc.stop(t + 0.22)
}

function synthSnare(ctx: BaseAudioContext, master: GainNode, t: number, v: number) {
  // Noise burst + sine body
  const noiseBuf = createNoiseBuffer(ctx)
  const noise = ctx.createBufferSource()
  noise.buffer = noiseBuf
  const noiseFilter = ctx.createBiquadFilter()
  noiseFilter.type = "highpass"
  noiseFilter.frequency.value = 2000
  const ng = connectGain(ctx, master, 0.0)
  const nenv = ng.gain
  nenv.setValueAtTime(0, t)
  nenv.linearRampToValueAtTime(0.7 * v, t + 0.001)
  nenv.exponentialRampToValueAtTime(0.0001, t + 0.18)
  noise.connect(noiseFilter)
  noiseFilter.connect(ng)
  noise.start(t)
  noise.stop(t + 0.22)

  const osc = ctx.createOscillator()
  osc.type = "triangle"
  osc.frequency.setValueAtTime(180, t)
  const og = connectGain(ctx, master, 0.0)
  const oenv = og.gain
  oenv.setValueAtTime(0, t)
  oenv.linearRampToValueAtTime(0.5 * v, t + 0.002)
  oenv.exponentialRampToValueAtTime(0.0001, t + 0.12)
  osc.connect(og)
  osc.start(t)
  osc.stop(t + 0.18)
}

function synthHiHat(ctx: BaseAudioContext, master: GainNode, t: number, v: number, open: boolean) {
  const noiseBuf = createNoiseBuffer(ctx)
  const noise = ctx.createBufferSource()
  noise.buffer = noiseBuf
  const bp = ctx.createBiquadFilter()
  bp.type = "bandpass"
  bp.frequency.value = 10000
  const hp = ctx.createBiquadFilter()
  hp.type = "highpass"
  hp.frequency.value = 7000
  const g = connectGain(ctx, master, 0.0)
  const env = g.gain
  const dur = open ? 0.45 : 0.05
  env.setValueAtTime(0, t)
  env.linearRampToValueAtTime(0.6 * v, t + 0.001)
  env.exponentialRampToValueAtTime(0.0001, t + dur)
  noise.connect(bp)
  bp.connect(hp)
  hp.connect(g)
  noise.start(t)
  noise.stop(t + dur + 0.02)
}

function synthClap(ctx: BaseAudioContext, master: GainNode, t: number, v: number) {
  // Simple multi-burst noise
  const noiseBuf = createNoiseBuffer(ctx)
  const bursts = [0, 0.01, 0.02, 0.03]
  for (const offset of bursts) {
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuf
    const hp = ctx.createBiquadFilter()
    hp.type = "highpass"
    hp.frequency.value = 1200
    const g = connectGain(ctx, master, 0.0)
    const env = g.gain
    const at = t + offset
    env.setValueAtTime(0, at)
    env.linearRampToValueAtTime(0.45 * v, at + 0.001)
    env.exponentialRampToValueAtTime(0.0001, at + 0.08)
    noise.connect(hp)
    hp.connect(g)
    noise.start(at)
    noise.stop(at + 0.1)
  }
}

function synthTom(ctx: BaseAudioContext, master: GainNode, t: number, v: number, freq: number) {
  const osc = ctx.createOscillator()
  const g = connectGain(ctx, master, 0.0)
  const env = g.gain
  osc.type = "sine"
  osc.frequency.setValueAtTime(freq, t)
  osc.frequency.exponentialRampToValueAtTime(freq * 0.7, t + 0.2)
  env.setValueAtTime(0, t)
  env.linearRampToValueAtTime(0.8 * v, t + 0.002)
  env.exponentialRampToValueAtTime(0.0001, t + 0.3)
  osc.connect(g)
  osc.start(t)
  osc.stop(t + 0.34)
}

function synthRim(ctx: BaseAudioContext, master: GainNode, t: number, v: number) {
  const osc = ctx.createOscillator()
  const g = connectGain(ctx, master, 0.0)
  const env = g.gain
  osc.type = "square"
  osc.frequency.setValueAtTime(800, t)
  env.setValueAtTime(0, t)
  env.linearRampToValueAtTime(0.5 * v, t + 0.001)
  env.exponentialRampToValueAtTime(0.0001, t + 0.03)
  osc.connect(g)
  osc.start(t)
  osc.stop(t + 0.05)
}

function synthCowbell(ctx: BaseAudioContext, master: GainNode, t: number, v: number) {
  const o1 = ctx.createOscillator()
  const o2 = ctx.createOscillator()
  o1.type = "square"
  o2.type = "square"
  o1.frequency.setValueAtTime(538, t)
  o2.frequency.setValueAtTime(800, t)
  const g = connectGain(ctx, master, 0.0)
  const env = g.gain
  env.setValueAtTime(0, t)
  env.linearRampToValueAtTime(0.6 * v, t + 0.001)
  env.exponentialRampToValueAtTime(0.0001, t + 0.18)
  o1.connect(g)
  o2.connect(g)
  o1.start(t)
  o2.start(t)
  o1.stop(t + 0.2)
  o2.stop(t + 0.2)
}

function synthShaker(ctx: BaseAudioContext, master: GainNode, t: number, v: number) {
  const noiseBuf = createNoiseBuffer(ctx)
  const noise = ctx.createBufferSource()
  noise.buffer = noiseBuf
  const hp = ctx.createBiquadFilter()
  hp.type = "highpass"
  hp.frequency.value = 6000
  const g = connectGain(ctx, master, 0.0)
  const env = g.gain
  env.setValueAtTime(0, t)
  env.linearRampToValueAtTime(0.5 * v, t + 0.001)
  env.exponentialRampToValueAtTime(0.0001, t + 0.2)
  noise.connect(hp)
  hp.connect(g)
  noise.start(t)
  noise.stop(t + 0.22)
}

function synthRide(ctx: BaseAudioContext, master: GainNode, t: number, v: number) {
  const noiseBuf = createNoiseBuffer(ctx)
  const noise = ctx.createBufferSource()
  noise.buffer = noiseBuf
  const bp = ctx.createBiquadFilter()
  bp.type = "bandpass"
  bp.frequency.value = 6000
  const g = connectGain(ctx, master, 0.0)
  const env = g.gain
  env.setValueAtTime(0, t)
  env.linearRampToValueAtTime(0.4 * v, t + 0.001)
  env.exponentialRampToValueAtTime(0.0001, t + 1.5)
  noise.connect(bp)
  bp.connect(g)
  noise.start(t)
  noise.stop(t + 1.6)
}

function synthCrash(ctx: BaseAudioContext, master: GainNode, t: number, v: number) {
  const noiseBuf = createNoiseBuffer(ctx)
  const noise = ctx.createBufferSource()
  noise.buffer = noiseBuf
  const hp = ctx.createBiquadFilter()
  hp.type = "highpass"
  hp.frequency.value = 3000
  const g = connectGain(ctx, master, 0.0)
  const env = g.gain
  env.setValueAtTime(0, t)
  env.linearRampToValueAtTime(0.5 * v, t + 0.001)
  env.exponentialRampToValueAtTime(0.0001, t + 1.2)
  noise.connect(hp)
  hp.connect(g)
  noise.start(t)
  noise.stop(t + 1.3)
}

function synthClave(ctx: BaseAudioContext, master: GainNode, t: number, v: number) {
  const osc = ctx.createOscillator()
  const g = connectGain(ctx, master, 0.0)
  const env = g.gain
  osc.type = "square"
  osc.frequency.setValueAtTime(1200, t)
  env.setValueAtTime(0, t)
  env.linearRampToValueAtTime(0.5 * v, t + 0.001)
  env.exponentialRampToValueAtTime(0.0001, t + 0.05)
  osc.connect(g)
  osc.start(t)
  osc.stop(t + 0.08)
}

function synthBassSine(ctx: BaseAudioContext, master: GainNode, t: number, v: number) {
  const osc = ctx.createOscillator()
  const g = connectGain(ctx, master, 0.0)
  osc.type = "sine"
  osc.frequency.setValueAtTime(55, t) // A1
  // slight pitch drop for punch
  osc.frequency.exponentialRampToValueAtTime(45, t + 0.12)
  const env = g.gain
  env.setValueAtTime(0, t)
  env.linearRampToValueAtTime(0.9 * v, t + 0.003)
  env.exponentialRampToValueAtTime(0.0001, t + 0.25)
  osc.connect(g)
  osc.start(t)
  osc.stop(t + 0.28)
}

function synthLeadSaw(ctx: BaseAudioContext, master: GainNode, t: number, v: number) {
  const osc = ctx.createOscillator()
  const g = connectGain(ctx, master, 0.0)
  osc.type = "sawtooth"
  osc.frequency.setValueAtTime(440, t) // A4
  const env = g.gain
  env.setValueAtTime(0, t)
  env.linearRampToValueAtTime(0.7 * v, t + 0.01)
  env.exponentialRampToValueAtTime(0.0001, t + 0.35)
  osc.connect(g)
  osc.start(t)
  osc.stop(t + 0.4)
}

function synthPadTri(ctx: BaseAudioContext, master: GainNode, t: number, v: number) {
  const osc = ctx.createOscillator()
  const g = connectGain(ctx, master, 0.0)
  osc.type = "triangle"
  osc.frequency.setValueAtTime(220, t) // A3
  const env = g.gain
  env.setValueAtTime(0, t)
  env.linearRampToValueAtTime(0.5 * v, t + 0.06)
  env.exponentialRampToValueAtTime(0.0001, t + 1.0)
  osc.connect(g)
  osc.start(t)
  osc.stop(t + 1.05)
}

function synthPluckFM(ctx: BaseAudioContext, master: GainNode, t: number, v: number) {
  // simple FM pluck (mod saw into sine frequency)
  const car = ctx.createOscillator()
  const mod = ctx.createOscillator()
  const modGain = ctx.createGain()
  car.type = "sine"
  mod.type = "sawtooth"
  car.frequency.setValueAtTime(330, t) // E4
  mod.frequency.setValueAtTime(660, t)
  modGain.gain.setValueAtTime(80, t)
  mod.connect(modGain)
  modGain.connect(car.frequency as unknown as AudioNode)

  const g = connectGain(ctx, master, 0.0)
  const env = g.gain
  env.setValueAtTime(0, t)
  env.linearRampToValueAtTime(0.6 * v, t + 0.004)
  env.exponentialRampToValueAtTime(0.0001, t + 0.25)

  car.connect(g)
  car.start(t)
  mod.start(t)
  car.stop(t + 0.28)
  mod.stop(t + 0.28)
}

function synthBleep(ctx: BaseAudioContext, master: GainNode, t: number, v: number) {
  const osc = ctx.createOscillator()
  const g = connectGain(ctx, master, 0.0)
  osc.type = "square"
  osc.frequency.setValueAtTime(880, t)
  osc.frequency.exponentialRampToValueAtTime(440, t + 0.12)
  const env = g.gain
  env.setValueAtTime(0, t)
  env.linearRampToValueAtTime(0.5 * v, t + 0.002)
  env.exponentialRampToValueAtTime(0.0001, t + 0.18)
  osc.connect(g)
  osc.start(t)
  osc.stop(t + 0.2)
}
