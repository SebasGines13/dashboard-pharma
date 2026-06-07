"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useDashboard } from "@/lib/dashboard-store"
import type { TipoAlerta } from "@/lib/mock-data"
import { AlertOctagon, AlertTriangle, Info, Check, X, BellRing } from "lucide-react"

const config: Record<
  TipoAlerta,
  { icon: typeof Info; dot: string; texto: string; bg: string }
> = {
  Crítica: { icon: AlertOctagon, dot: "bg-destructive", texto: "text-destructive", bg: "bg-destructive/10" },
  Advertencia: { icon: AlertTriangle, dot: "bg-chart-3", texto: "text-chart-3", bg: "bg-chart-3/10" },
  Info: { icon: Info, dot: "bg-chart-2", texto: "text-chart-2", bg: "bg-chart-2/10" },
}

function tiempoRelativo(min: number) {
  if (min < 1) return "ahora"
  if (min < 60) return `hace ${min} min`
  const h = Math.floor(min / 60)
  return `hace ${h} h`
}

export function AlertasPanel() {
  const { alertas, resolverAlerta, descartarAlerta, kpis } = useDashboard()
  const ordenadas = [...alertas].sort((a, b) => a.haceMin - b.haceMin)

  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <BellRing className="size-4 text-primary" aria-hidden="true" />
            Centro de alertas
          </CardTitle>
          <Badge
            variant="outline"
            className={cn(
              "tabular-nums",
              kpis.alertasActivas > 0
                ? "border-destructive/30 bg-destructive/10 text-destructive"
                : "text-muted-foreground",
            )}
          >
            {kpis.alertasActivas} activas
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">Eventos por desvío en orden cronológico</p>
      </CardHeader>
      <CardContent>
        <ol className="relative flex flex-col gap-1 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
          {ordenadas.map((a) => {
            const c = config[a.tipo]
            const Icon = c.icon
            return (
              <li key={a.id} className="relative flex gap-3 pb-4 last:pb-0">
                <span
                  className={cn(
                    "relative z-10 mt-1 flex size-3.5 shrink-0 items-center justify-center rounded-full ring-4 ring-card",
                    a.resuelta ? "bg-muted-foreground" : c.dot,
                  )}
                  aria-hidden="true"
                >
                  {!a.resuelta && a.tipo === "Crítica" && (
                    <span className={cn("absolute inline-flex size-full animate-ping rounded-full opacity-70", c.dot)} />
                  )}
                </span>
                <div
                  className={cn(
                    "flex-1 rounded-lg border border-border p-3",
                    a.resuelta ? "opacity-60" : c.bg,
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Icon className={cn("size-3.5", a.resuelta ? "text-muted-foreground" : c.texto)} aria-hidden="true" />
                        <p className="text-sm font-medium text-foreground">{a.titulo}</p>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{a.descripcion}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{a.linea}</span>
                        <span aria-hidden="true">·</span>
                        <span>{tiempoRelativo(a.haceMin)}</span>
                        {a.resuelta && (
                          <Badge variant="outline" className="border-chart-5/30 bg-chart-5/10 text-chart-5">
                            Resuelta
                          </Badge>
                        )}
                      </div>
                    </div>
                    {!a.resuelta && (
                      <div className="flex shrink-0 gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7 text-chart-5 hover:text-chart-5"
                          onClick={() => resolverAlerta(a.id)}
                          aria-label="Marcar como resuelta"
                          title="Resolver"
                        >
                          <Check className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7 text-muted-foreground"
                          onClick={() => descartarAlerta(a.id)}
                          aria-label="Descartar alerta"
                          title="Descartar"
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}
