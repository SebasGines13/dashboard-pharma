"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  Activity,
  AlertTriangle,
  ClipboardCheck,
  Timer,
  Gauge,
  PenLine,
  TrendingUp,
  TrendingDown,
  type LucideIcon,
} from "lucide-react"
import { useDashboard } from "@/lib/dashboard-store"

interface KpiCardProps {
  label: string
  value: string
  icon: LucideIcon
  helper?: string
  delta?: { valor: string; positivo: boolean }
  tone?: "default" | "alert"
  active?: boolean
  onClick?: () => void
}

function KpiCard({ label, value, icon: Icon, helper, delta, tone = "default", active, onClick }: KpiCardProps) {
  const interactive = !!onClick
  return (
    <Card
      className={cn(
        "gap-0 py-0 transition-colors",
        interactive && "cursor-pointer hover:border-ring/60 hover:bg-accent/40",
        active && "border-ring ring-1 ring-ring",
      )}
      onClick={onClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onClick?.()
              }
            }
          : undefined
      }
    >
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground text-balance">{label}</span>
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-md",
              tone === "alert" ? "bg-destructive/15 text-destructive" : "bg-accent text-accent-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
          </span>
        </div>
        <div className="flex items-end justify-between gap-2">
          <span className="text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
          {delta && (
            <span
              className={cn(
                "flex items-center gap-0.5 text-xs font-medium",
                delta.positivo ? "text-chart-5" : "text-destructive",
              )}
            >
              {delta.positivo ? (
                <TrendingUp className="size-3" aria-hidden="true" />
              ) : (
                <TrendingDown className="size-3" aria-hidden="true" />
              )}
              {delta.valor}
            </span>
          )}
        </div>
        {helper && <span className="text-xs text-muted-foreground">{helper}</span>}
      </CardContent>
    </Card>
  )
}

export function KpiGrid() {
  const { kpis, filtroEstado, setFiltroEstado } = useDashboard()

  const toggle = (estado: "En ejecución" | "En revisión") =>
    setFiltroEstado(filtroEstado === estado ? "Todos" : estado)

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
      <KpiCard
        label="OEE global"
        value={`${kpis.oeeGlobal}%`}
        icon={Gauge}
        delta={{ valor: "+2.1%", positivo: true }}
        helper="Eficiencia de planta"
      />
      <KpiCard
        label="Órdenes activas"
        value={String(kpis.ordenesActivas)}
        icon={Activity}
        delta={{ valor: "+2", positivo: true }}
        helper="Líneas en ejecución"
        active={filtroEstado === "En ejecución"}
        onClick={() => toggle("En ejecución")}
      />
      <KpiCard
        label="Excepciones abiertas"
        value={String(kpis.excepcionesAbiertas)}
        icon={AlertTriangle}
        delta={{ valor: "-3", positivo: true }}
        helper="Requieren atención"
        tone={kpis.excepcionesAbiertas > 0 ? "alert" : "default"}
      />
      <KpiCard
        label="Lotes en revisión"
        value={String(kpis.lotesEnRevision)}
        icon={ClipboardCheck}
        helper="Pendientes de calidad"
        active={filtroEstado === "En revisión"}
        onClick={() => toggle("En revisión")}
      />
      <KpiCard
        label="Firmas pendientes"
        value={String(kpis.firmasPendientes)}
        icon={PenLine}
        helper="21 CFR Part 11"
        tone={kpis.firmasPendientes > 0 ? "alert" : "default"}
      />
      <KpiCard
        label="Tiempo liberación"
        value={`${kpis.tiempoLiberacionPromedio.toFixed(1)} h`}
        icon={Timer}
        helper="vs 15 días (papel)"
      />
      <KpiCard
        label="Cumplimiento GMP"
        value={`${kpis.cumplimientoGMP}%`}
        icon={ClipboardCheck}
        delta={{ valor: "+0.4%", positivo: true }}
        helper="Registros electrónicos"
      />
    </div>
  )
}
