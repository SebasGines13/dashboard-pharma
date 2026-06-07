"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDashboard } from "@/lib/dashboard-store"
import { PenLine, ShieldCheck, Clock, CheckCircle2 } from "lucide-react"

export function FirmasPanel() {
  const { firmas, firmar } = useDashboard()

  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <PenLine className="size-4 text-primary" aria-hidden="true" />
            Firmas electrónicas pendientes
          </CardTitle>
          <Badge variant="outline" className="gap-1 border-primary/40 bg-accent text-accent-foreground">
            <ShieldCheck className="size-3" aria-hidden="true" />
            21 CFR Part 11
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">Registros que requieren tu aprobación</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {firmas.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <CheckCircle2 className="size-8 text-chart-5" aria-hidden="true" />
            <p className="text-sm font-medium text-foreground">Sin firmas pendientes</p>
            <p className="text-xs text-muted-foreground">Todos los registros del turno están firmados.</p>
          </div>
        ) : (
          firmas.map((f) => (
            <div
              key={f.id}
              className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-foreground">{f.documento}</p>
                  {f.urgente && (
                    <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">
                      Urgente
                    </Badge>
                  )}
                </div>
                <p className="truncate text-xs text-muted-foreground">{f.paso}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  <span>
                    {f.linea} · {f.lote}
                  </span>
                  <span>
                    {f.responsable} ({f.rol})
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" aria-hidden="true" />
                    Vence {f.vence}
                  </span>
                </div>
              </div>
              <Button size="sm" className="shrink-0 gap-1.5" onClick={() => firmar(f.id)}>
                <PenLine className="size-3.5" aria-hidden="true" />
                Firmar
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
