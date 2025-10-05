export type VoiceCategory = "Kicks" | "Snares" | "Hats" | "Percussion" | "Cymbals" | "FX" | "Bass" | "Lead" | "Pad"

export const VOICE_CATALOG: { category: VoiceCategory; voices: { name: string; voice: string }[] }[] = [
  {
    category: "Kicks",
    voices: [
      { name: "Kick", voice: "kick" },
      { name: "Sub Kick", voice: "subkick" },
      { name: "808 Kick", voice: "808_kick" },
      { name: "909 Kick", voice: "909_kick" },
      { name: "Acoustic Kick", voice: "acoustic_kick" },
      { name: "Electronic Kick", voice: "electronic_kick" },
    ],
  },
  {
    category: "Snares",
    voices: [
      { name: "Snare", voice: "snare" },
      { name: "Clap", voice: "clap" },
      { name: "Snare Snap", voice: "snare_snap" },
      { name: "Snare Acoustic", voice: "snare_acoustic" },
      { name: "Snare Electronic", voice: "snare_elec" },
      { name: "Snare Muted", voice: "snare_muted" },
      { name: "Cross Stick", voice: "cross_stick" },
      { name: "Side Stick", voice: "side_stick" },
      { name: "Handclap (Close)", voice: "handclap_close" },
      { name: "Handclap (Room)", voice: "handclap_room" },
      { name: "Finger Snap", voice: "finger_snap" },
      { name: "Snap", voice: "snap" },
      { name: "Clap Body", voice: "clap_body" },
    ],
  },
  {
    category: "Hats",
    voices: [
      { name: "Closed Hat", voice: "hihat" },
      { name: "Open Hat", voice: "openhat" },
      { name: "Shaker", voice: "shaker" },
      { name: "Pedal Hat", voice: "pedal_hat" },
      { name: "Loose Hat", voice: "loose_hat" },
      { name: "Sizzle Hat", voice: "sizzle" },
      { name: "Bell Hat", voice: "bell_hat" },
    ],
  },
  {
    category: "Percussion",
    voices: [
      { name: "Tom", voice: "tom" },
      { name: "Perc 1", voice: "perc1" },
      { name: "Perc 2", voice: "perc2" },
      { name: "Rim", voice: "rim" },
      { name: "Clave", voice: "clave" },
      { name: "Bongo", voice: "bongo" },
      { name: "Conga", voice: "conga" },
      { name: "Tom High", voice: "tom_high" },
      { name: "Tom Mid", voice: "tom_mid" },
      { name: "Tom Low", voice: "tom_low" },
      { name: "Floor Tom", voice: "floor_tom" },
      { name: "Tambourine", voice: "tambourine" },
      { name: "Maracas", voice: "maracas" },
      { name: "Djembe", voice: "djembe" },
      { name: "Darbuka", voice: "darbuka" },
      { name: "Cajon", voice: "cajon" },
      { name: "Timbale", voice: "timbale" },
      { name: "Bongos (Var)", voice: "bongos_var" },
      { name: "Conga High", voice: "conga_high" },
      { name: "Conga Low", voice: "conga_low" },
      { name: "Udu", voice: "udu" },
      { name: "Tabla", voice: "tabla" },
      { name: "Tamb", voice: "tamb" },
      { name: "Guiro", voice: "guiro" },
      { name: "Cabasa", voice: "cabasa" },
      { name: "Temple Block", voice: "temple_block" },
      { name: "Agogo", voice: "agogo" },
      { name: "Metallic Hit", voice: "metallic_hit" },
      { name: "Marimba", voice: "marimba" },
      { name: "Vibraphone", voice: "vibraphone" },
      { name: "Glockenspiel", voice: "glockenspiel" },
      { name: "Kalimba", voice: "kalimba" },
      { name: "Stomp", voice: "stomp" },
      { name: "Throat Hit", voice: "throat_hit" },
    ],
  },
  { category: "Bass", voices: [{ name: "Bass Sine", voice: "bass_sine" }] },
  { category: "Lead", voices: [{ name: "Lead Saw", voice: "lead_saw" }] },
  { category: "Pad", voices: [{ name: "Pad Tri", voice: "pad_tri" }] },
  {
    category: "FX",
    voices: [
      { name: "Pluck FM", voice: "pluck_fm" },
      { name: "Bleep", voice: "fx_bleep" },
      { name: "Click", voice: "click" },
      { name: "Pulse", voice: "pulse" },
      { name: "Glitch", voice: "glitch" },
      { name: "Clicky", voice: "clicky" },
      { name: "Bitcrush Hit", voice: "bitcrush_hit" },
      { name: "Tape Pop", voice: "tape_pop" },
      { name: "Vinyl Scratch", voice: "vinyl_scratch" },
      { name: "Riser", voice: "riser" },
      { name: "Impact", voice: "impact" },
      { name: "Sweep", voice: "sweep" },
      { name: "Clap Body", voice: "clap_body" },
    ],
  },
]

export function getCategoryForVoice(voice: string): VoiceCategory {
  switch (voice) {
    case "kick":
    case "subkick":
    case "808_kick":
    case "909_kick":
    case "acoustic_kick":
    case "electronic_kick":
      return "Kicks"
    case "snare":
    case "snare_snap":
    case "snare_acoustic":
    case "snare_elec":
    case "snare_muted":
    case "cross_stick":
    case "side_stick":
    case "clap":
    case "handclap_close":
    case "handclap_room":
    case "finger_snap":
    case "snap":
    case "clap_body":
      return "Snares"
    case "hihat":
    case "openhat":
    case "shaker":
    case "pedal_hat":
    case "loose_hat":
    case "sizzle":
    case "bell_hat":
      return "Hats"
    case "ride":
    case "ride_bell":
    case "ride_edge":
    case "crash":
    case "reverse_crash":
    case "swell":
    case "splash":
    case "splash_small":
    case "china":
    case "cowbell":
    case "bell":
    case "tubular_bell":
      return "Cymbals"
    case "tom":
    case "tom_high":
    case "tom_mid":
    case "tom_low":
    case "floor_tom":
    case "perc1":
    case "perc2":
    case "rim":
    case "clave":
    case "bongo":
    case "bongos_var":
    case "conga":
    case "conga_high":
    case "conga_low":
    case "tambourine":
    case "maracas":
    case "djembe":
    case "darbuka":
    case "cajon":
    case "timbale":
    case "udu":
    case "tabla":
    case "tamb":
    case "guiro":
    case "cabasa":
    case "temple_block":
    case "agogo":
    case "metallic_hit":
    case "marimba":
    case "vibraphone":
    case "glockenspiel":
    case "kalimba":
    case "stomp":
    case "throat_hit":
      return "Percussion"
    case "bass_sine":
      return "Bass"
    case "lead_saw":
      return "Lead"
    case "pad_tri":
      return "Pad"
    case "pluck_fm":
    case "fx_bleep":
    case "click":
    case "pulse":
    case "glitch":
    case "clicky":
    case "bitcrush_hit":
    case "tape_pop":
    case "vinyl_scratch":
    case "riser":
    case "impact":
    case "sweep":
      return "FX"
    default:
      return "FX"
  }
}

export const CATEGORY_COLORS: Record<VoiceCategory, string> = {
  Kicks: "hsl(var(--cat-kick))",
  Snares: "hsl(var(--cat-snare))",
  Hats: "hsl(var(--cat-hat))",
  Percussion: "hsl(var(--cat-perc))",
  Cymbals: "hsl(var(--cat-cymbal))",
  FX: "hsl(var(--cat-fx))",
  Bass: "hsl(var(--cat-fx))",
  Lead: "hsl(var(--cat-fx))",
  Pad: "hsl(var(--cat-fx))",
}

export function catalogByCategory() {
  return VOICE_CATALOG.map((group) => ({
    category: group.category,
    items: group.voices.map((v) => ({
      id: v.voice,
      name: v.name,
    })),
  }))
}

export function searchVoices(query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const results: { id: string; name: string; category: VoiceCategory }[] = []

  for (const group of VOICE_CATALOG) {
    for (const v of group.voices) {
      const id = v.voice
      const name = v.name
      // match on display name or internal id
      if (name.toLowerCase().includes(q) || id.toLowerCase().includes(q)) {
        results.push({ id, name, category: group.category })
      }
    }
  }

  // Optional simple ranking: startsWith before includes, then by name length
  results.sort((a, b) => {
    const aName = a.name.toLowerCase()
    const bName = b.name.toLowerCase()
    const aStarts = aName.startsWith(q) ? 0 : 1
    const bStarts = bName.startsWith(q) ? 0 : 1
    if (aStarts !== bStarts) return aStarts - bStarts
    return aName.length - bName.length
  })

  return results
}

export { getCategoryForVoice as categoryForVoice }
