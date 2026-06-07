"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Pill, Circle, Moon, Sun, MapPin, Clock, UserCog } from "lucide-react"
import { useDashboard } from "@/lib/dashboard-store"

export function DashboardHeader() {
  const { enVivo, toggleEnVivo, tema, toggleTema, ultimaActualizacion } = useDashboard()
  const [montado, setMontado] = useState(false)

  useEffect(() => setMontado(true), [])

  const hoy = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const hora = montado
    ? ultimaActualizacion.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "—"

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        {/* Identidad */}
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Pill className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold leading-tight text-foreground text-balance">
                Torre de Control — Empaque PharmaXXX
              </h1>
              <Badge variant="outline" className="border-primary/40 bg-accent text-accent-foreground">
                MES
              </Badge>
            </div>
            <p className="text-xs capitalize text-muted-foreground">{hoy}</p>
          </div>
        </div>

        {/* Contexto operativo */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Planta Pilar — Sector Sólidos
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Turno Mañana (06:00–14:00)
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <UserCog className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Supervisor: P. Méndez
          </span>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm tabular-nums text-foreground" aria-label="Hora actual">
            {hora}
          </span>
          <Separator orientation="vertical" className="h-6" />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTema}
            aria-label={tema === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
            title={tema === "dark" ? "Modo claro" : "Modo oscuro"}
          >
            {tema === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Badge
              variant="outline"
              className={
                enVivo
                  ? "gap-1.5 border-primary/40 bg-primary/10 text-primary"
                  : "gap-1.5 text-muted-foreground"
              }
            >
              <Circle
                className={`h-2 w-2 ${enVivo ? "animate-pulse fill-primary text-primary" : "fill-muted-foreground text-muted-foreground"}`}
                aria-hidden="true"
              />
              {enVivo ? "En vivo" : "Pausado"}
            </Badge>
            <Switch checked={enVivo} onCheckedChange={toggleEnVivo} aria-label="Activar actualización en vivo" />
          </label>
        </div>
      </div>
    </header>
  )
}
