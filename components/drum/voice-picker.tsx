"use client"
import { useMemo, useState } from "react"
import { catalogByCategory, searchVoices, CATEGORY_COLORS } from "@/lib/voice-catalog"

export function VoicePicker({ onSelect, onClose }: { onSelect: (voiceId: string) => void; onClose: () => void }) {
  const [query, setQuery] = useState("")
  const results = useMemo(() => (query ? searchVoices(query) : undefined), [query])
  const groups = useMemo(() => catalogByCategory(), [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className="relative w-full max-w-lg rounded-lg border p-4 md:p-6"
        style={{ backgroundColor: "hsl(var(--color-toolbar-bg))", borderColor: "hsl(var(--color-toolbar-border))" }}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-pretty text-lg font-semibold">Choose a Drum Voice</h2>
          <button onClick={onClose} className="rounded-md px-2 py-1 text-sm hover:opacity-80">
            Close
          </button>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search voices..."
          className="w-full rounded-md border px-3 py-2 text-sm outline-none"
          style={{ backgroundColor: "hsl(var(--color-step-bg))", borderColor: "hsl(var(--color-step-border))" }}
        />
        <div className="mt-4 max-h-80 overflow-y-auto pr-1">
          {results ? (
            <div className="grid grid-cols-2 gap-2">
              {results.map((v) => (
                <button
                  key={v.id}
                  onClick={() => onSelect(v.id)}
                  className="flex items-center gap-2 rounded-md border px-2 py-2 text-left hover:opacity-90"
                  style={{ borderColor: "hsl(var(--color-step-border))" }}
                >
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ background: CATEGORY_COLORS[v.category] }}
                  />
                  <span className="text-sm">{v.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {groups.map((g) => (
                <div key={g.category}>
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ background: CATEGORY_COLORS[g.category] }}
                    />
                    <h3 className="text-sm font-medium">{g.category}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {g.items.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => onSelect(v.id)}
                        className="flex items-center gap-2 rounded-md border px-2 py-2 text-left hover:opacity-90"
                        style={{ borderColor: "hsl(var(--color-step-border))" }}
                      >
                        <span className="text-sm">{v.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
