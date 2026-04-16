import { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, MessageSquare, ThumbsUp, Camera, Globe, Users as UsersIcon, X, Bot, RefreshCw } from 'lucide-react';
import LiveTimer from './LiveTimer';
import AssignmentReason from './AssignmentReason';

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
  ok: { label: 'OK', bg: 'bg-ar-ok-light', text: 'text-ar-ok', ring: 'ring-ar-ok/20' },
  atencion: { label: 'Atencion', bg: 'bg-ar-warn-light', text: 'text-amber-700', ring: 'ring-ar-warn/20' },
  vencido: { label: 'Vencido', bg: 'bg-ar-crit-light', text: 'text-ar-crit', ring: 'ring-ar-crit/20' },
};

function ReassignmentBadge({ lead, sellers }) {
  const [showHistory, setShowHistory] = useState(false);
  if (lead.reassignments === 0) return <span className="text-xs text-ar-gray-300">0</span>;

  const history = lead.reassignmentHistory || [];
  const isAutoSla = lead.timeline?.some(e => e.icon === 'sla_warning');

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setShowHistory(!showHistory); }}
        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-ar-crit-light text-ar-crit text-xs font-bold hover:bg-ar-crit/10 transition-colors cursor-pointer"
      >
        <RefreshCw className="w-3 h-3" />
        {lead.reassignments}x
        {isAutoSla && <span className="w-1.5 h-1.5 rounded-full bg-ar-crit animate-pulse" />}
      </button>

      {showHistory && history.length > 0 && (
        <div className="absolute z-30 top-full mt-1 right-0 w-56 bg-white rounded-lg border border-ar-gray-200 shadow-xl p-3" onClick={e => e.stopPropagation()}>
          <p className="text-[10px] font-bold text-ar-gray-400 uppercase tracking-wider mb-2">Historial de asignacion</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            {history.map((h, i) => (
              <div key={i} className="flex items-center gap-1">
                <span className="text-xs font-medium text-ar-gray-700">{h.sellerName.split(' ')[0]}</span>
                {i < history.length - 1 && <span className="text-ar-gray-300 text-xs">&#8594;</span>}
              </div>
            ))}
          </div>
          {isAutoSla && (
            <p className="text-[10px] text-ar-crit font-medium mt-2 flex items-center gap-1">
              <Bot className="w-3 h-3" />
              Reasignacion automatica por SLA
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function LeadsTable({ leads, sellers, onSelectLead }) {
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [slaFilter, setSlaFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [sellerFilter, setSellerFilter] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [reasonPopover, setReasonPopover] = useState(null);

  const sellerMap = useMemo(() => {
    const map = {};
    sellers.forEach(s => { map[s.id] = s; });
    return map;
  }, [sellers]);

  const activeFilters = [
    regionFilter !== 'all' && { key: 'region', label: regionFilter, clear: () => setRegionFilter('all') },
    statusFilter !== 'all' && { key: 'status', label: statusFilter, clear: () => setStatusFilter('all') },
    slaFilter !== 'all' && { key: 'sla', label: slaFilter, clear: () => setSlaFilter('all') },
    channelFilter !== 'all' && { key: 'channel', label: channelFilter, clear: () => setChannelFilter('all') },
    sellerFilter !== 'all' && { key: 'seller', label: sellerMap[sellerFilter]?.name || sellerFilter, clear: () => setSellerFilter('all') },
  ].filter(Boolean);

  const filtered = useMemo(() => {
    let result = [...leads];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.product.toLowerCase().includes(q) ||
        (l.sellerId && sellerMap[l.sellerId]?.name.toLowerCase().includes(q))
      );
    }
    if (regionFilter !== 'all') result = result.filter(l => l.region === regionFilter);
    if (statusFilter !== 'all') result = result.filter(l => l.status === statusFilter);
    if (slaFilter !== 'all') result = result.filter(l => l.sla === slaFilter);
    if (channelFilter !== 'all') result = result.filter(l => l.channel === channelFilter);
    if (sellerFilter !== 'all') result = result.filter(l => l.sellerId === sellerFilter);

    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'createdAt' || sortField === 'assignedAt') {
        aVal = aVal ? new Date(aVal).getTime() : 0;
        bVal = bVal ? new Date(bVal).getTime() : 0;
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [leads, search, regionFilter, statusFilter, slaFilter, channelFilter, sellerFilter, sortField, sortDir, sellerMap]);

  const handleSort = (field) => {
    if (sortField === field) { setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }
    else { setSortField(field); setSortDir('desc'); }
  };

  const uniqueChannels = [...new Set(leads.map(l => l.channel))];
  const uniqueRegions = [...new Set(leads.map(l => l.region))].filter(Boolean);

  const selectClass = "appearance-none pl-3 pr-7 py-2 bg-white border border-ar-gray-200 rounded-lg text-xs font-medium text-ar-gray-600 focus:outline-none focus:ring-2 focus:ring-ar-steel/15 focus:border-ar-steel/30 cursor-pointer hover:border-ar-gray-300 transition-all";

  const getRowClass = (lead) => {
    if (lead.sla === 'vencido' && lead.status === 'asignado')
      return 'border-l-[3px] border-l-ar-crit bg-ar-crit-light/50 hover:bg-ar-crit-light/80';
    if (lead.sla === 'atencion' && lead.status === 'asignado')
      return 'border-l-[3px] border-l-ar-warn bg-ar-warn-light/50 hover:bg-ar-warn-light/80';
    return 'border-l-[3px] border-l-transparent hover:bg-ar-gray-50';
  };

  return (
    <div className="bg-white rounded-xl border border-ar-gray-200/80 overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="p-4 border-b border-ar-gray-100 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex items-center flex-1 max-w-sm">
            <Search className="absolute left-3 w-4 h-4 text-ar-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, ciudad, producto..."
              className="w-full pl-10 pr-4 py-2 bg-ar-gray-50 border border-ar-gray-200 rounded-lg text-sm placeholder:text-ar-gray-400 focus:outline-none focus:ring-2 focus:ring-ar-steel/15 focus:border-ar-steel/30 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex items-center">
              <Filter className="absolute left-3 w-3.5 h-3.5 text-ar-gray-400 pointer-events-none" />
              <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2 bg-white border border-ar-gray-200 rounded-lg text-xs font-medium text-ar-gray-600 focus:outline-none focus:ring-2 focus:ring-ar-steel/15 cursor-pointer hover:border-ar-gray-300 transition-all">
                <option value="all">Region</option>
                {uniqueRegions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 w-3 h-3 text-ar-gray-400 pointer-events-none" />
            </div>

            <div className="relative flex items-center">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
                <option value="all">Status</option>
                <option value="nuevo">Nuevo</option>
                <option value="asignado">Asignado</option>
                <option value="aceptado">Aceptado</option>
                <option value="contactado">Contactado</option>
              </select>
              <ChevronDown className="absolute right-2 w-3 h-3 text-ar-gray-400 pointer-events-none" />
            </div>

            <div className="relative flex items-center">
              <select value={slaFilter} onChange={(e) => setSlaFilter(e.target.value)} className={selectClass}>
                <option value="all">SLA</option>
                <option value="ok">OK</option>
                <option value="atencion">Atencion</option>
                <option value="vencido">Vencido</option>
              </select>
              <ChevronDown className="absolute right-2 w-3 h-3 text-ar-gray-400 pointer-events-none" />
            </div>

            <div className="relative flex items-center">
              <select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)} className={selectClass}>
                <option value="all">Canal</option>
                {uniqueChannels.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-2 w-3 h-3 text-ar-gray-400 pointer-events-none" />
            </div>

            <div className="relative flex items-center">
              <select value={sellerFilter} onChange={(e) => setSellerFilter(e.target.value)} className={selectClass}>
                <option value="all">Vendedor</option>
                {sellers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <ChevronDown className="absolute right-2 w-3 h-3 text-ar-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="text-xs text-ar-gray-400 ml-auto tabular-nums font-medium">
            {filtered.length} de {leads.length}
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-ar-gray-400 uppercase tracking-wider">Filtros:</span>
            {activeFilters.map(f => (
              <button key={f.key} onClick={f.clear}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-ar-steel text-white text-xs font-medium hover:bg-ar-steel-dark transition-colors cursor-pointer">
                {f.label}
                <X className="w-3 h-3" />
              </button>
            ))}
            <button onClick={() => { setRegionFilter('all'); setStatusFilter('all'); setSlaFilter('all'); setChannelFilter('all'); setSellerFilter('all'); }}
              className="text-[11px] text-ar-gray-400 hover:text-ar-steel cursor-pointer ml-1">
              Limpiar todos
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-ar-gray-100 bg-ar-gray-50/50">
              {[
                { label: 'Nombre', field: 'name' },
                { label: 'Canal', field: 'channel' },
                { label: 'Region', field: 'region' },
                { label: 'Equipo', field: 'product' },
                { label: 'Vendedor', field: 'sellerId' },
                { label: 'Status', field: 'status' },
                { label: 'Tiempo', field: 'createdAt' },
                { label: 'SLA', field: 'sla' },
                { label: 'Reasig.', field: 'reassignments' },
              ].map(col => (
                <th key={col.field} onClick={() => handleSort(col.field)}
                  className="px-4 py-3 text-[10px] font-bold text-ar-gray-400 uppercase tracking-wider cursor-pointer hover:text-ar-gray-600 transition-colors select-none">
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortField === col.field && (
                      <ChevronDown className={`w-3 h-3 transition-transform ${sortDir === 'asc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => {
              const ChannelIcon = channelIcons[lead.channel] || Globe;
              const status = statusConfig[lead.status];
              const sla = slaConfig[lead.sla];
              const seller = lead.sellerId ? sellerMap[lead.sellerId] : null;

              return (
                <tr key={lead.id} onClick={() => onSelectLead(lead)}
                  className={`border-b border-ar-gray-50 cursor-pointer transition-all duration-150 group ${getRowClass(lead)}`}>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-ar-gray-700 group-hover:text-ar-steel transition-colors">{lead.name}</p>
                      <p className="text-[11px] text-ar-gray-400">{lead.city}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium ${channelColors[lead.channel] || 'bg-ar-gray-100 text-ar-gray-600'}`}>
                      <ChannelIcon className="w-3 h-3" />
                      {lead.channel}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-ar-gray-100 text-[10px] font-bold text-ar-gray-600 tracking-wide uppercase">
                      {lead.region}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-ar-gray-600">{lead.product}</td>
                  <td className="px-4 py-3">
                    {seller ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-gradient-to-br from-ar-steel to-ar-violet flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                          {seller.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-medium text-ar-gray-700 block truncate">{seller.name.split(' ')[0]}</span>
                          {lead.assignmentReason && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setReasonPopover(reasonPopover === lead.id ? null : lead.id); }}
                              className="flex items-center gap-0.5 cursor-pointer">
                              <AssignmentReason reason={lead.assignmentReason} compact />
                            </button>
                          )}
                        </div>
                        {reasonPopover === lead.id && lead.assignmentReason && (
                          <div className="absolute z-40 mt-2 ml-8" onClick={e => e.stopPropagation()}>
                            <div className="w-72 bg-white rounded-lg border border-ar-gray-200 shadow-2xl p-4">
                              <AssignmentReason reason={lead.assignmentReason} />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-[11px] text-ar-gray-400">Sin asignar</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium ${status.bg} ${status.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <LiveTimer date={lead.assignedAt || lead.createdAt} sla={lead.sla} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ring-1 ${sla.bg} ${sla.text} ${sla.ring} ${
                      lead.sla === 'vencido' ? 'animate-pulse' : ''
                    }`}>
                      {sla.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ReassignmentBadge lead={lead} sellers={sellers} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-sm text-ar-gray-400">No se encontraron leads con los filtros actuales.</p>
        </div>
      )}
    </div>
  );
}