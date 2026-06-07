"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"
import { useDashboard } from "@/lib/dashboard-store"

export function TiempoLiberacionChart() {
  const { tiempoLiberacion } = useDashboard()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tiempo de liberación por lote</CardTitle>
        <CardDescription>Horas hasta liberación · últimos 12 lotes (objetivo 1.5 h)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            horas: { label: "Horas", color: "var(--chart-1)" },
            objetivo: { label: "Objetivo", color: "var(--chart-4)" },
          }}
          className="h-[240px] w-full"
        >
          <LineChart data={tiempoLiberacion} margin={{ left: 4, right: 12, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="lote" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={28} unit="h" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ReferenceLine y={1.5} stroke="var(--color-objetivo)" strokeDasharray="4 4" />
            <Line
              dataKey="horas"
              type="monotone"
              stroke="var(--color-horas)"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "var(--color-horas)" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function ProduccionChart() {
  const { produccionPorHora } = useDashboard()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Producción del turno</CardTitle>
        <CardDescription>Unidades empacadas por hora (en miles)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ unidades: { label: "Unidades (k)", color: "var(--chart-2)" } }}
          className="h-[240px] w-full"
        >
          <AreaChart data={produccionPorHora} margin={{ left: 4, right: 12, top: 8 }}>
            <defs>
              <linearGradient id="fillUnidades" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-unidades)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-unidades)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="hora" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={28} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="unidades"
              type="monotone"
              stroke="var(--color-unidades)"
              strokeWidth={2.5}
              fill="url(#fillUnidades)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function IncidenciaChart() {
  const { incidenciaPorLinea, filtroEstado } = useDashboard()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Incidencia por línea</CardTitle>
        <CardDescription>Excepciones abiertas por línea</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ excepciones: { label: "Excepciones", color: "var(--chart-1)" } }}
          className="h-[240px] w-full"
        >
          <BarChart data={incidenciaPorLinea} margin={{ left: 4, right: 12, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="linea" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={24} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="excepciones" radius={[6, 6, 0, 0]}>
              {incidenciaPorLinea.map((entry) => (
                <Cell
                  key={entry.linea}
                  fill={entry.excepciones >= 3 ? "var(--destructive)" : "var(--chart-1)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function EstadoOrdenesChart() {
  const { distribucionEstados } = useDashboard()
  const total = distribucionEstados.reduce((acc, d) => acc + d.valor, 0)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado de órdenes</CardTitle>
        <CardDescription>Distribución actual de las {total} líneas</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ valor: { label: "Líneas" } }}
          className="mx-auto aspect-square h-[240px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="estado" />} />
            <Pie data={distribucionEstados} dataKey="valor" nameKey="estado" innerRadius={55} strokeWidth={3}>
              {distribucionEstados.map((d) => (
                <Cell key={d.estado} fill={d.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
          {distribucionEstados.map((d) => (
            <div key={d.estado} className="flex items-center gap-2">
              <span className="size-2.5 rounded-full" style={{ background: d.fill }} aria-hidden="true" />
              <span className="text-muted-foreground">{d.estado}</span>
              <span className="ml-auto font-medium tabular-nums">{d.valor}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ResumenTurnoCard() {
  const { resumenTurno, oeeHistorico } = useDashboard()
  const factores = [
    { label: "Disponibilidad", valor: resumenTurno.disponibilidad },
    { label: "Rendimiento", valor: resumenTurno.rendimiento },
    { label: "First Pass Yield", valor: resumenTurno.firstPassYield },
  ]
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>Resumen del turno</CardTitle>
        <CardDescription>Factores del OEE y métricas de digitalización</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-end gap-2">
          <span className="text-4xl font-semibold tabular-nums text-foreground">{resumenTurno.oeeGlobal}%</span>
          <span className="pb-1 text-sm text-muted-foreground">OEE global del turno</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {factores.map((f) => (
            <div key={f.label}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{f.label}</span>
                <span className="font-medium tabular-nums text-foreground">{f.valor}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${f.valor}%` }} />
              </div>
            </div>
          ))}
        </div>

        <ChartContainer config={{ oee: { label: "OEE", color: "var(--chart-1)" } }} className="h-[90px] w-full">
          <AreaChart data={oeeHistorico} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="fillOee" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-oee)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-oee)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="dia" tickLine={false} axisLine={false} tickMargin={6} fontSize={10} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area dataKey="oee" type="monotone" stroke="var(--color-oee)" strokeWidth={2} fill="url(#fillOee)" />
          </AreaChart>
        </ChartContainer>
        <p className="-mt-2 text-center text-xs text-muted-foreground">OEE últimos 7 días</p>

        <div className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
          <div>
            <p className="text-lg font-semibold tabular-nums text-foreground">{resumenTurno.lotesLiberados}</p>
            <p className="text-xs text-muted-foreground">Lotes liberados</p>
          </div>
          <div>
            <p className="text-lg font-semibold tabular-nums text-foreground">{resumenTurno.tiempoLiberacionPromedio}</p>
            <p className="text-xs text-muted-foreground">Liberación prom.</p>
          </div>
          <div>
            <p className="text-lg font-semibold tabular-nums text-chart-5">{resumenTurno.papelGenerado}</p>
            <p className="text-xs text-muted-foreground">Papel generado</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
