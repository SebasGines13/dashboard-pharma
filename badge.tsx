"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useDashboard } from "@/lib/dashboard-store"

export function LotesRevisionPanel() {
  const { lotes } = useDashboard()
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Lotes en revisión</CardTitle>
        <CardDescription>Reconciliación de materiales pendiente de aprobación de calidad</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="flex flex-col gap-4">
          {lotes.map((lote) => (
            <li key={lote.id} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{lote.producto}</p>
                  <p className="text-xs text-muted-foreground">
                    {lote.id} · {lote.linea} · {lote.cantidad.toLocaleString("es-AR")} u
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums">{lote.reconciliacion}%</span>
              </div>
              <Progress value={lote.reconciliacion} className="h-2" />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
