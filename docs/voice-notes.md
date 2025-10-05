Below I list useful additional drum/percussion voices and sonic categories that your current union is missing (grouped, with short descriptions and reasons why they help), plus a ready-to-paste expanded VoiceName union and a few structural suggestions (choke groups, articulations, params) so the engine can take advantage of the extra variety.

What your list currently lacks (by category)
Kicks & Low Bass

subkick / 808_kick / 909_kick / acoustic_kick / electronic_kick

Adds very different low-end characters (deep 808 sub vs short punchy acoustic kick).

Useful for modern electronic / trap vs rock / acoustic kits.

Snares & Snare Variants

snare_snap / snare_acoustic / snare_elec / snare_muted / cross_stick / side_stick

Adds different textures (tight snap, roomy acoustic, lo-fi clipped).

Cross-stick/side-stick is crucial for many genres.

Hi-hats & Cymbals (more articulations)

pedal_hat / loose_hat / sizzle / bell_hat / splash / china / splash_small

Allows more groove shaping (pedal hats for subtle rhythms, bell/sizzle for texture).

closedhat (explicit) — you use hihat & openhat but explicit closed/pedal variants give clarity.

Toms & Tonal Drums

tom_high / tom_mid / tom_low / floor_tom

Multi-pitched toms let you do fills and more melodic drum patterns.

Hand Percussion & World

tambourine / maracas / djembe / darbuka / cajon / timbale / bongos_var (left/right) / conga_high / conga_low / udu / tabla

Great for organic/world/Latin grooves and adds unique rhythmic textures.

Shakers / Small Percussion

maracas (distinct from shaker) / tamb / guiro / cabasa / bell / temple_block

Different small-perc sounds give more motion and realism.

Claps & Fingers

snap / finger_snap / handclap_close / handclap_room

Snap vs clap differences matter in electronic/lo-fi/pop styles.

Metallic / Bell-like

bell / tubular_bell / agogo / metallic_hit

Useful accents and melodic percussion.

Rim / Sticks

rim_click / rimshot (you have rim) / stick_click

Useful for percussive accents and subtle grooves.

Electronic/Glitch / Textures / Effects

click / pulse / glitch / clicky / bitcrush_hit / tape_pop / vinyl_scratch / riser / impact / sweep

For modern EDM/IDM/beat-making textures and transitions.

reverse_crash / swell

Useful FX to transition bar sections.

Cymbal Varieties & Articulations

china / splash / ride_bell / ride_edge

Ride bell vs ride bow vs cymbal edge give expressive control.

Foley / Human / Body Sounds

stomp / clap_body / finger_snap / throat_hit

Adds organic percussive color for experimental beats.

Tuned / Melodic Percussion (optional)

marimba / vibraphone / glockenspiel / kalimba

If you want pitched-percussion feel in rhythmic parts.

Extra engine-friendly ideas (behavioural & metadata)

Choke groups: e.g., closedhat chokes openhat. Add chokeGroup metadata so playing one stops/shortens another.

Articulations: open/closed/pedal for hats; rim/crossstick for snare; muted/open for toms.

Polyphony vs monophony flags: some voices (like crash) are long — consider choke/mono behavior.

Velocity sensitivity: allow different samples/filters for velocity ranges.

Pitch/tune: allow a tune param for per-step pitch changes (for toms, bongo, melodic percussion).

Sample vs synth fallback: mark whether voice is sample-based or synth-generated.

Suggested color mapping (category → color)

Kicks: #FF4D4D (red)

Snares: #4DA6FF (blue)

Hats: #FFD24D (yellow)

Percussion (congas, bongos, shakers): #4DFF88 (green)

Cymbals/Fx: #C084FC (purple)

World: #FF9F4D (orange)

Electronic/Glitch: #00E5FF (cyan)
