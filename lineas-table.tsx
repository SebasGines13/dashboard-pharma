"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SeveridadBadge } from "@/components/status-badges"
import { useDashboard } from "@/lib/dashboard-store"
import { ArrowRight, Check } from "lucide-react"

const estadoExcepcionStyles: Record<string, string> = {
  Abierta: "bg-destructive/15 text-destructive border-destructive/30",
  "En análisis": "bg-chart-3/15 text-chart-3 border-chart-3/30",
  Resuelta: "bg-chart-5/15 text-chart-5 border-chart-5/30",
}

export function ExcepcionesPanel() {
  const { excepciones, avanzarExcepcion, resolverExcepcion } = useDashboard()
  const abiertas = excepciones.filter((e) => e.estado !== "Resuelta").length

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle>Excepciones y alertas por desvío</CardTitle>
            <CardDescription>Revisión por excepción · {abiertas} requieren atención</CardDescription>
          </div>
          <Badge variant="outline" className="border-destructive/30 bg-destructive/15 text-destructive">
            {abiertas} activas
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="flex flex-col gap-3">
          {excepciones.map((e) => {
            const resuelta = e.estado === "Resuelta"
            return (
              <li
                key={e.id}
                className={`flex flex-col gap-2 rounded-lg border bg-card p-3 transition-opacity ${resuelta ? "opacity-60" : ""}`}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-medium text-muted-foreground">{e.id}</span>
                      <SeveridadBadge severidad={e.severidad} />
                      <span className="text-xs text-muted-foreground">
                        {e.linea} · {e.lote}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-pretty">{e.descripcion}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                    <Badge variant="outline" className={estadoExcepcionStyles[e.estado]}>
                      {e.estado}
                    </Badge>
                    <span className="text-xs tabular-nums text-muted-foreground">{e.hora}</span>
                  </div>
                </div>
                {!resuelta && (
                  <div className="flex items-center justify-end gap-2 border-t pt-2">
                    {e.estado === "Abierta" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 gap-1 text-xs"
                        onClick={() => avanzarExcepcion(e.id)}
                      >
                        Tomar caso
                        <ArrowRight className="size-3.5" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1 text-xs"
                      onClick={() => resolverExcepcion(e.id)}
                    >
                      <Check className="size-3.5" />
                      Resolver
                    </Button>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
