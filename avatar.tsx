"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EstadoBadge } from "@/components/status-badges"
import { LineaDetailDialog } from "@/components/linea-detail-dialog"
import { useDashboard } from "@/lib/dashboard-store"
import type { Linea, EstadoOrden } from "@/lib/mock-data"
import { AlertTriangle, Search, X } from "lucide-react"

const ESTADOS: (EstadoOrden | "Todos")[] = [
  "Todos",
  "En ejecución",
  "En revisión",
  "Liberado",
  "Detenido",
  "Programado",
]

export function LineasTable() {
  const {
    lineasFiltradas,
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    resetFiltros,
    lineas,
  } = useDashboard()
  const [seleccionada, setSeleccionada] = useState<Linea | null>(null)

  const hayFiltros = busqueda.trim() !== "" || filtroEstado !== "Todos"
  // mantener el detalle sincronizado con el estado vivo
  const detalleActual = seleccionada ? lineas.find((l) => l.id === seleccionada.id) ?? null : null

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <CardTitle>Estado de ejecución de líneas</CardTitle>
            <CardDescription>Avance, excepciones y tiempo estimado de liberación por línea</CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar producto, lote, operador…"
                className="pl-8 sm:w-64"
                aria-label="Buscar líneas"
              />
            </div>
            <Select value={filtroEstado} onValueChange={(v) => setFiltroEstado(v as EstadoOrden | "Todos")}>
              <SelectTrigger className="sm:w-44" aria-label="Filtrar por estado">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                {ESTADOS.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hayFiltros && (
              <Button variant="ghost" size="sm" onClick={resetFiltros} className="gap-1">
                <X className="size-4" />
                Limpiar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="hidden grid-cols-[1.6fr_1fr_1.4fr_0.8fr_1fr] gap-4 border-b px-6 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground lg:grid">
          <span>Línea / Producto</span>
          <span>Estado</span>
          <span>Avance</span>
          <span className="text-center">Excep.</span>
          <span className="text-right">Liberación est.</span>
        </div>

        {lineasFiltradas.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-muted-foreground">
            No hay líneas que coincidan con los filtros.
          </p>
        ) : (
          <ul className="divide-y">
            {lineasFiltradas.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => setSeleccionada(l)}
                  className="grid w-full grid-cols-1 gap-3 px-6 py-4 text-left transition-colors hover:bg-accent/40 lg:grid-cols-[1.6fr_1fr_1.4fr_0.8fr_1fr] lg:items-center lg:gap-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{l.nombre}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {l.producto} · {l.lote} · {l.operador}
                    </p>
                  </div>
                  <div>
                    <EstadoBadge estado={l.estado} />
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={l.avance} className="h-2" />
                    <span className="w-9 shrink-0 text-right text-xs font-medium tabular-nums text-muted-foreground">
                      {l.avance}%
                    </span>
                  </div>
                  <div className="lg:text-center">
                    {l.excepcionesAbiertas > 0 ? (
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-destructive">
                        <AlertTriangle className="size-3.5" />
                        {l.excepcionesAbiertas}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </div>
                  <div className="text-sm tabular-nums lg:text-right">
                    {l.tiempoLiberacionEstimado}
                    {l.reconciliacionPendiente && (
                      <span className="ml-2 inline-flex rounded bg-chart-3/15 px-1.5 py-0.5 text-[10px] font-medium text-chart-3">
                        Recon. pend.
                      </span>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <LineaDetailDialog
        linea={detalleActual}
        open={!!seleccionada}
        onOpenChange={(o) => !o && setSeleccionada(null)}
      />
    </Card>
  )
}
