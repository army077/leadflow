import LeadsTable from './LeadsTable';

export default function LeadsPage({ leads, sellers, onSelectLead }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-ar-slate-900 tracking-tight">Leads</h2>
        <p className="text-sm text-ar-gray-400 mt-1">Gestión completa de leads del sistema</p>
      </div>
      <LeadsTable leads={leads} sellers={sellers} onSelectLead={onSelectLead} />
    </div>
  );
}
