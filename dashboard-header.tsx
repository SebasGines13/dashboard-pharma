import { DashboardProvider } from "@/lib/dashboard-store"
import { DashboardHeader } from "@/components/dashboard-header"
import { KpiGrid } from "@/components/kpi-grid"
import { OEESemaforo } from "@/components/oee-semaforo"
import { FirmasPanel } from "@/components/firmas-panel"
import { AlertasPanel } from "@/components/alertas-panel"
import {
  TiempoLiberacionChart,
  ProduccionChart,
  IncidenciaChart,
  EstadoOrdenesChart,
  ResumenTurnoCard,
} from "@/components/dashboard-charts"
import { LineasTable } from "@/components/lineas-table"
import { ExcepcionesPanel } from "@/components/excepciones-panel"
import { LotesRevisionPanel } from "@/components/lotes-revision-panel"
import { ShieldCheck, Database, FileCheck2 } from "lucide-react"

export default function Page() {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="mx-auto flex max-w-[1600px] flex-col gap-5 px-4 py-5 lg:px-6">
          <section aria-label="Indicadores clave">
            <KpiGrid />
          </section>

          <section aria-label="Semáforo OEE">
            <OEESemaforo />
          </section>

          <section className="grid gap-5 xl:grid-cols-3" aria-label="Alertas y resumen de turno">
            <div className="xl:col-span-2">
              <AlertasPanel />
            </div>
            <ResumenTurnoCard />
          </section>

          <section className="grid gap-5 lg:grid-cols-2" aria-label="Firmas y estado de órdenes">
            <FirmasPanel />
            <EstadoOrdenesChart />
          </section>

          <section className="grid gap-5 lg:grid-cols-3" aria-label="Tendencias operativas">
            <div className="lg:col-span-2">
              <TiempoLiberacionChart />
            </div>
            <IncidenciaChart />
          </section>

          <section aria-label="Producción del turno">
            <ProduccionChart />
          </section>

          <section aria-label="Ejecución de líneas">
            <LineasTable />
          </section>

          <section className="grid gap-5 lg:grid-cols-2" aria-label="Excepciones y lotes en revisión">
            <ExcepcionesPanel />
            <LotesRevisionPanel />
          </section>

          <footer className="flex flex-col items-center gap-3 border-t border-border pb-8 pt-5 text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
                21 CFR Part 11 · Anexo 11 GMP
              </span>
              <span className="flex items-center gap-1.5">
                <Database className="size-3.5 text-primary" aria-hidden="true" />
                Integrado con MES / SAP
              </span>
              <span className="flex items-center gap-1.5">
                <FileCheck2 className="size-3.5 text-primary" aria-hidden="true" />
                Registros electrónicos · Audit trail
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-pretty">
              Maqueta interactiva con datos simulados · Caso &quot;Digitalización del proceso de empaque en industria
              farmacéutica&quot; · Grupo 10
            </p>
          </footer>
        </main>
      </div>
    </DashboardProvider>
  )
}
