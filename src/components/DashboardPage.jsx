import KPICards from './KPICards';
import LeadsTable from './LeadsTable';
import AlertBanner from './AlertBanner';
import MiniCharts from './MiniCharts';

export default function DashboardPage({ leads, sellers, onSelectLead }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ar-slate-900 tracking-tight">Centro de control</h2>
          <p className="text-sm text-ar-gray-400 mt-0.5">Operaciones en tiempo real</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-ar-ok-light border border-ar-ok/20">
          <span className="w-2 h-2 rounded-full bg-ar-ok animate-pulse" />
          <span className="text-xs font-semibold text-ar-ok">En vivo</span>
        </div>
      </div>

      <AlertBanner leads={leads} sellers={sellers} />

      <KPICards leads={leads} />

      <MiniCharts leads={leads} />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-ar-slate-700 uppercase tracking-wide">Leads recientes</h3>
        </div>
        <LeadsTable leads={leads} sellers={sellers} onSelectLead={onSelectLead} />
      </div>
    </div>
  );
}
