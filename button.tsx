"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useDashboard, estadoOEE } from "@/lib/dashboard-store"
import type { Linea } from "@/lib/mock-data"
import { LineaDetailDialog } from "@/components/linea-detail-dialog"
import { useState } from "react"
import { Gauge } from "lucide-react"

const semaforo: Record<string, { dot: string; ring: string; texto: string }> = {
  Operativa: { dot: "bg-chart-5", ring: "ring-chart-5/30", texto: "text-chart-5" },
  Atención: { dot: "bg-chart-3", ring: "ring-chart-3/30", texto: "text-chart-3" },
  Detenida: { dot: "bg-destructive", ring: "ring-destructive/30", texto: "text-destructive" },
}

function OEECard({ linea, onClick }: { linea: Linea; onClick: () => void }) {
  const estado = estadoOEE(linea)
  const s = semaforo[estado]
  const programada = linea.estado === "Programado"

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-ring/60 hover:bg-accent/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
      aria-label={`${linea.nombre}, OEE ${linea.oee}%, estado ${estado}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">{linea.id}</p>
          <p className="text-xs text-muted-foreground">{linea.producto}</p>
        </div>
        <span className="flex items-center gap-1.5">
          <span className="relative flex size-2.5">
            {estado !== "Detenida" && !programada && (
              <span className={cn("absolute inline-flex size-full animate-ping rounded-full opacity-60", s.dot)} />
            )}
            <span className={cn("relative inline-flex size-2.5 rounded-full", programada ? "bg-muted-foreground" : s.dot)} />
          </span>
          <span className={cn("text-xs font-medium", programada ? "text-muted-foreground" : s.texto)}>
            {programada ? "Programada" : estado}
          </span>
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-1">
          <Gauge className={cn("size-4", programada ? "text-muted-foreground" : s.texto)} aria-hidden="true" />
          <span className="text-2xl font-semibold tabular-nums text-foreground">{linea.oee}</span>
          <span className="text-sm text-muted-foreground">% OEE</span>
        </div>
        <span className="text-xs tabular-nums text-muted-foreground">
          {linea.velocidad > 0 ? `${linea.velocidad} u/min` : "—"}
        </span>
      </div>

      {/* Desglose D x R x C */}
      <div className="grid grid-cols-3 gap-2 border-t border-border pt-2 text-center">
        {[
          { l: "Disp.", v: linea.disponibilidad },
          { l: "Rend.", v: linea.rendimiento },
          { l: "FPY", v: linea.calidad },
        ].map((m) => (
          <div key={m.l}>
            <p className="text-xs tabular-nums font-medium text-foreground">{m.v}%</p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{m.l}</p>
          </div>
        ))}
      </div>
    </button>
  )
}

export function OEESemaforo() {
  const { lineas } = useDashboard()
  const [seleccion, setSeleccion] = useState<Linea | null>(null)

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-base">Semáforo OEE por línea</CardTitle>
        <p className="text-sm text-muted-foreground">Eficiencia general de equipos en tiempo real</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {lineas.map((l) => (
            <OEECard key={l.id} linea={l} onClick={() => setSeleccion(l)} />
          ))}
        </div>
      </CardContent>
      <LineaDetailDialog
        linea={seleccion}
        open={!!seleccion}
        onOpenChange={(o) => !o && setSeleccion(null)}
      />
    </Card>
  )
}
