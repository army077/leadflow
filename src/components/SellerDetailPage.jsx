import { useState, useMemo } from 'react';
import { ArrowLeft, Search, MapPin, Mail, Clock, CheckCircle2, AlertTriangle, MessageSquare, ThumbsUp, Camera, Globe, Users as UsersIcon, RefreshCw } from 'lucide-react';
import LiveTimer from './LiveTimer';

const channelIcons = {
  WhatsApp: MessageSquare,
  Facebook: ThumbsUp,
  Instagram: Camera,
  Web: Globe,
  Referido: UsersIcon,
};

const channelColors = {
  WhatsApp: 'bg-emerald-50 text-emerald-700',
  Facebook: 'bg-ar-steel-light text-ar-steel',
  Instagram: 'bg-ar-violet-light text-ar-violet',
  Web: 'bg-ar-gray-100 text-ar-gray-600',
  Referido: 'bg-ar-coral-light text-ar-coral',
};

const statusConfig = {
  nuevo: { label: 'Nuevo', bg: 'bg-ar-gray-100', text: 'text-ar-gray-600', dot: 'bg-ar-gray-400' },
  asignado: { label: 'Asignado', bg: 'bg-ar-steel-light', text: 'text-ar-steel', dot: 'bg-ar-steel' },
  aceptado: { label: 'Aceptado', bg: 'bg-ar-ok-light', text: 'text-ar-ok', dot: 'bg-ar-ok' },
  contactado: { label: 'Contactado', bg: 'bg-ar-gray-100', text: 'text-ar-gray-500', dot: 'bg-ar-gray-400' },
};

const slaConfig = {
  ok: { bg: 'bg-ar-ok-light', text: 'text-ar-ok' },
  atencion: { bg: 'bg-ar-warn-light', text: 'text-amber-700' },
  vencido: { bg: 'bg-ar-crit-light', text: 'text-ar-crit' },
};

export default function SellerDetailPage({ seller, leads, onBack, onSelectLead }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const sellerLeads = useMemo(() => {
    return leads.filter(l => l.sellerId === seller.id);
  }, [leads, seller.id]);

  const stats = useMemo(() => {
    const total = sellerLeads.length;
    const asignados = sellerLeads.filter(l => l.status === 'asignado').length;
    const aceptados = sellerLeads.filter(l => l.status === 'aceptado').length;
    const contactados = sellerLeads.filter(l => l.status === 'contactado').length;
    const active = sellerLeads.filter(l => l.status !== 'contactado').length;
    const accepted = sellerLeads.filter(l => l.acceptedAt && l.assignedAt);
    const avgResponse = accepted.length > 0
      ? Math.round(accepted.reduce((sum, l) => sum + (new Date(l.acceptedAt) - new Date(l.assignedAt)) / (1000 * 60), 0) / accepted.length)
      : null;
    const slaVencidos = sellerLeads.filter(l => l.sla === 'vencido').length;
    return { total, asignados, aceptados, contactados, active, avgResponse, slaVencidos };
  }, [sellerLeads]);

  const filtered = useMemo(() => {
    let result = [...sellerLeads];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.product.toLowerCase().includes(q) ||
        l.channel.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter(l => l.status === statusFilter);
    }
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return result;
  }, [sellerLeads, search, statusFilter]);

  const tabs = [
    { key: 'all', label: 'Todos', count: stats.total },
    { key: 'asignado', label: 'Asignados', count: stats.asignados },
    { key: 'aceptado', label: 'Aceptados', count: stats.aceptados },
    { key: 'contactado', label: 'Contactados', count: stats.contactados },
  ];

  const loadPercent = Math.min(100, (stats.total / seller.maxLeads) * 100);

  return (
    <div className="space-y-6">
      {/* Back + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-ar-gray-200 hover:bg-ar-gray-50 hover:border-ar-gray-300 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-ar-slate-700" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-ar-slate-900 tracking-tight">Detalle del vendedor</h2>
          <p className="text-sm text-ar-gray-400 mt-0.5">Información y prospectos asignados</p>
        </div>
      </div>

      {/* Seller Info Card */}
      <div className="bg-white rounded-xl border border-ar-gray-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-ar-steel to-ar-violet flex items-center justify-center text-white font-bold text-2xl shrink-0">
            {seller.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-lg font-bold text-ar-slate-900">{seller.name}</h3>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                seller.status === 'activo'
                  ? 'bg-ar-ok/10 text-ar-ok'
                  : 'bg-ar-warn/10 text-amber-700'
              }`}>
                {seller.status === 'activo' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                {seller.status === 'activo' ? 'Activo' : 'Saturado'}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-1.5 text-sm text-ar-gray-500">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{seller.email}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{seller.region}</span>
            </div>
          </div>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-3 mt-6">
          <div className="bg-ar-steel-light rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-ar-steel">{stats.active}</p>
            <p className="text-[10px] font-bold text-ar-gray-400 uppercase tracking-wider mt-0.5">Activos</p>
          </div>
          <div className="bg-ar-warn-light rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-ar-warn">{stats.asignados}</p>
            <p className="text-[10px] font-bold text-ar-gray-400 uppercase tracking-wider mt-0.5">Asignados</p>
          </div>
          <div className="bg-ar-ok-light rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-ar-ok">{stats.aceptados}</p>
            <p className="text-[10px] font-bold text-ar-gray-400 uppercase tracking-wider mt-0.5">Aceptados</p>
          </div>
          <div className="bg-ar-gray-100 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-ar-gray-500">{stats.contactados}</p>
            <p className="text-[10px] font-bold text-ar-gray-400 uppercase tracking-wider mt-0.5">Contactados</p>
          </div>
          <div className="bg-ar-violet-light rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-ar-violet">{stats.avgResponse !== null ? `${stats.avgResponse}m` : '—'}</p>
            <p className="text-[10px] font-bold text-ar-gray-400 uppercase tracking-wider mt-0.5">Resp. prom.</p>
          </div>
          <div className="bg-ar-coral-light rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-ar-coral">{stats.slaVencidos}</p>
            <p className="text-[10px] font-bold text-ar-gray-400 uppercase tracking-wider mt-0.5">SLA vencido</p>
          </div>
        </div>

        {/* Load bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-ar-gray-400 mb-1.5">
            <span>Carga actual</span>
            <span className="font-bold text-ar-gray-700">{stats.total} / {seller.maxLeads}</span>
          </div>
          <div className="h-2 bg-ar-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                loadPercent >= 100 ? 'bg-ar-crit' : loadPercent >= 75 ? 'bg-ar-warn' : 'bg-ar-ok'
              }`}
              style={{ width: `${loadPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Search + Tabs */}
      <div className="bg-white rounded-xl border border-ar-gray-200/80 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-ar-gray-100 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex items-center flex-1 max-w-sm">
              <Search className="absolute left-3 w-4 h-4 text-ar-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar prospecto, ciudad, producto..."
                className="w-full pl-10 pr-4 py-2 bg-ar-gray-50 border border-ar-gray-200 rounded-lg text-sm placeholder:text-ar-gray-400 focus:outline-none focus:ring-2 focus:ring-ar-steel/15 focus:border-ar-steel/30 transition-all"
              />
            </div>
            <div className="flex items-center gap-1 bg-ar-gray-50 rounded-lg p-1">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    statusFilter === tab.key
                      ? 'bg-white text-ar-steel shadow-sm'
                      : 'text-ar-gray-500 hover:text-ar-gray-700'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-1.5 text-[10px] ${statusFilter === tab.key ? 'text-ar-steel' : 'text-ar-gray-400'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-ar-gray-50/80 text-ar-gray-400 text-[11px] uppercase tracking-wider font-bold">
                <th className="text-left py-3 px-4">Prospecto</th>
                <th className="text-left py-3 px-4">Canal</th>
                <th className="text-left py-3 px-4">Producto</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">SLA</th>
                <th className="text-left py-3 px-4">Tiempo</th>
                <th className="text-center py-3 px-4">Reasign.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ar-gray-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-ar-gray-400 text-sm">
                    No se encontraron prospectos
                  </td>
                </tr>
              )}
              {filtered.map(lead => {
                const status = statusConfig[lead.status] || statusConfig.nuevo;
                const sla = slaConfig[lead.sla] || slaConfig.ok;
                const ChannelIcon = channelIcons[lead.channel] || Globe;
                const chColor = channelColors[lead.channel] || channelColors.Web;

                const rowClass = lead.sla === 'vencido' && lead.status === 'asignado'
                  ? 'border-l-[3px] border-l-ar-crit bg-ar-crit-light/50 hover:bg-ar-crit-light/80'
                  : lead.sla === 'atencion' && lead.status === 'asignado'
                  ? 'border-l-[3px] border-l-ar-warn bg-ar-warn-light/50 hover:bg-ar-warn-light/80'
                  : 'border-l-[3px] border-l-transparent hover:bg-ar-gray-50';

                return (
                  <tr
                    key={lead.id}
                    onClick={() => onSelectLead(lead)}
                    className={`transition-colors cursor-pointer ${rowClass}`}
                  >
                    <td className="py-3 px-4">
                      <p className="font-medium text-ar-gray-800 hover:text-ar-steel transition-colors">{lead.name}</p>
                      <p className="text-xs text-ar-gray-400 mt-0.5">{lead.city} · {lead.region}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${chColor}`}>
                        <ChannelIcon className="w-3 h-3" />
                        {lead.channel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-ar-gray-600">{lead.product}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 rounded-md text-xs font-semibold ${sla.bg} ${sla.text}`}>
                        {lead.sla === 'ok' ? 'OK' : lead.sla === 'atencion' ? 'Atención' : 'Vencido'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <LiveTimer createdAt={lead.createdAt} sla={lead.sla} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      {lead.reassignments > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-ar-crit-light text-ar-crit text-xs font-bold">
                          <RefreshCw className="w-3 h-3" />
                          {lead.reassignments}x
                        </span>
                      ) : (
                        <span className="text-xs text-ar-gray-300">0</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-ar-gray-100 text-xs text-ar-gray-400">
          Mostrando {filtered.length} de {sellerLeads.length} prospectos
        </div>
      </div>
    </div>
  );
}
