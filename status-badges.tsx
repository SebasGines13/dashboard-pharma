"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { EstadoBadge } from "@/components/status-badges"
import { useDashboard } from "@/lib/dashboard-store"
import type { Linea } from "@/lib/mock-data"
import { CheckCircle2, Pause, Play, AlertTriangle, User, Boxes, Clock } from "lucide-react"

interface Props {
  linea: Linea | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LineaDetailDialog({ linea, open, onOpenChange }: Props) {
  const { liberarLinea, detenerLinea, reanudarLinea } = useDashboard()
  if (!linea) return null

  const puedeLiberar = linea.estado === "En revisión" && !linea.reconciliacionPendiente
  const puedeDetener = linea.estado === "En ejecución"
  const puedeReanudar = linea.estado === "Detenido"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3 pr-6">
            <DialogTitle>{linea.nombre}</DialogTitle>
            <EstadoBadge estado={linea.estado} />
          </div>
          <DialogDescription>
            {linea.producto} · Lote {linea.lote}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Avance de empaque</span>
              <span className="font-medium tabular-nums">{linea.avance}%</span>
            </div>
            <Progress value={linea.avance} className="h-2" />
          </div>

          <Separator />

          <div className="rounded-md border border-border bg-muted/40 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">OEE de la línea</span>
              <span className="text-sm font-semibold tabular-nums">{linea.oee}%</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p className="font-medium tabular-nums">{linea.disponibilidad}%</p>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Disponib.</p>
              </div>
              <div>
                <p className="font-medium tabular-nums">{linea.rendimiento}%</p>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Rendim.</p>
              </div>
              <div>
                <p className="font-medium tabular-nums">{linea.calidad}%</p>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">FPY</p>
              </div>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <User className="mt-0.5 size-4 text-muted-foreground" />
              <div>
                <dt className="text-xs text-muted-foreground">Operador</dt>
                <dd className="font-medium">{linea.operador}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 size-4 text-muted-foreground" />
              <div>
                <dt className="text-xs text-muted-foreground">Liberación estimada</dt>
                <dd className="font-medium tabular-nums">{linea.tiempoLiberacionEstimado}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 size-4 text-muted-foreground" />
              <div>
                <dt className="text-xs text-muted-foreground">Excepciones abiertas</dt>
                <dd className="font-medium tabular-nums">{linea.excepcionesAbiertas}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Boxes className="mt-0.5 size-4 text-muted-foreground" />
              <div>
                <dt className="text-xs text-muted-foreground">Reconciliación</dt>
                <dd className="font-medium">
                  {linea.reconciliacionPendiente ? (
                    <span className="text-chart-3">Pendiente</span>
                  ) : (
                    <span className="text-chart-5">Completa</span>
                  )}
                </dd>
              </div>
            </div>
          </dl>

          {linea.reconciliacionPendiente && (
            <p className="rounded-md bg-chart-3/10 px-3 py-2 text-xs text-chart-3">
              No se puede liberar el lote hasta resolver la reconciliación de materiales pendiente.
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          {puedeDetener && (
            <Button
              variant="outline"
              onClick={() => detenerLinea(linea.id)}
              className="gap-1.5 text-destructive hover:text-destructive"
            >
              <Pause className="size-4" />
              Detener línea
            </Button>
          )}
          {puedeReanudar && (
            <Button variant="outline" onClick={() => reanudarLinea(linea.id)} className="gap-1.5">
              <Play className="size-4" />
              Reanudar
            </Button>
          )}
          <Button onClick={() => liberarLinea(linea.id)} disabled={!puedeLiberar} className="gap-1.5">
            <CheckCircle2 className="size-4" />
            Liberar lote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
