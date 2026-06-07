import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { EstadoOrden, Severidad } from "@/lib/mock-data"

const estadoStyles: Record<EstadoOrden, string> = {
  "En ejecución": "bg-chart-1/15 text-chart-1 border-chart-1/30",
  "En revisión": "bg-chart-3/15 text-chart-3 border-chart-3/30",
  Liberado: "bg-chart-5/15 text-chart-5 border-chart-5/30",
  Detenido: "bg-destructive/15 text-destructive border-destructive/30",
  Programado: "bg-muted text-muted-foreground border-border",
}

export function EstadoBadge({ estado }: { estado: EstadoOrden }) {
  return (
    <Badge variant="outline" className={cn("font-medium", estadoStyles[estado])}>
      {estado}
    </Badge>
  )
}

const severidadStyles: Record<Severidad, string> = {
  Crítica: "bg-destructive/15 text-destructive border-destructive/30",
  Mayor: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  Menor: "bg-muted text-muted-foreground border-border",
}

export function SeveridadBadge({ severidad }: { severidad: Severidad }) {
  return (
    <Badge variant="outline" className={cn("font-medium", severidadStyles[severidad])}>
      {severidad}
    </Badge>
  )
}
