import { useMemo } from 'react';
import { User, MapPin, Clock, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export default function SellersTable({ sellers, leads, onSelectSeller }) {
  const sellerStats = useMemo(() => {
    return sellers.map(seller => {
      const sellerLeads = leads.filter(l => l.sellerId === seller.id);
      const activeLeads = sellerLeads.filter(l => l.status !== 'contactado').length;
      const pendingLeads = sellerLeads.filter(l => l.status === 'asignado').length;

      const accepted = sellerLeads.filter(l => l.acceptedAt && l.assignedAt);
      const avgResponse = accepted.length > 0
        ? Math.round(accepted.reduce((sum, l) => sum + (new Date(l.acceptedAt) - new Date(l.assignedAt)) / (1000 * 60), 0) / accepted.length)
        : null;

      return {
        ...seller,
        totalLeads: sellerLeads.length,
        activeLeads,
        pendingLeads,
        avgResponse,
      };
    });
  }, [sellers, leads]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ar-slate-900 tracking-tight">Vendedores</h2>
          <p className="text-sm text-ar-gray-400 mt-1">Gestión y rendimiento del equipo de ventas</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-ar-ok" />
            <span className="text-ar-gray-500">{sellers.filter(s => s.status === 'activo').length} activos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-ar-warn" />
            <span className="text-ar-gray-500">{sellers.filter(s => s.status === 'saturado').length} saturados</span>
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sellerStats.map(seller => (
          <div
            key={seller.id}
            onClick={() => onSelectSeller?.(seller)}
            className="bg-white rounded-xl border border-ar-gray-200/80 p-6 hover:shadow-md hover:border-ar-gray-300/80 transition-all duration-200 group cursor-pointer"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ar-steel to-ar-violet flex items-center justify-center text-white font-bold text-lg">
                  {seller.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ar-gray-800">{seller.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-ar-gray-400" />
                    <span className="text-xs text-ar-gray-400">{seller.region}</span>
                  </div>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold ${
                seller.status === 'activo'
                  ? 'bg-ar-ok/10 text-ar-ok'
                  : 'bg-ar-warn/10 text-amber-700'
              }`}>
                {seller.status === 'activo' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                {seller.status === 'activo' ? 'Activo' : 'Saturado'}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-ar-steel-light rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-ar-steel">{seller.activeLeads}</p>
                <p className="text-[10px] font-bold text-ar-gray-400 uppercase tracking-wider mt-0.5">Activos</p>
              </div>
              <div className="bg-ar-warn-light rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-ar-warn">{seller.pendingLeads}</p>
                <p className="text-[10px] font-bold text-ar-gray-400 uppercase tracking-wider mt-0.5">Pendientes</p>
              </div>
              <div className="bg-ar-violet-light rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-ar-violet">{seller.avgResponse !== null ? `${seller.avgResponse}m` : '—'}</p>
                <p className="text-[10px] font-bold text-ar-gray-400 uppercase tracking-wider mt-0.5">Promedio</p>
              </div>
            </div>

            {/* Load bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] text-ar-gray-400 mb-1.5">
                <span>Carga actual</span>
                <span className="font-bold text-ar-gray-700">{seller.totalLeads} / {seller.maxLeads}</span>
              </div>
              <div className="h-1.5 bg-ar-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    seller.totalLeads / seller.maxLeads >= 1
                      ? 'bg-ar-crit'
                      : seller.totalLeads / seller.maxLeads >= 0.75
                      ? 'bg-ar-warn'
                      : 'bg-ar-ok'
                  }`}
                  style={{ width: `${Math.min(100, (seller.totalLeads / seller.maxLeads) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
