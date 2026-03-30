import { X, UserPlus, Phone, Clock, Zap, Bell, CheckCircle2, RefreshCw, Mail, MapPin, Package, MessageSquare, AlertTriangle, Bot, Shield } from 'lucide-react';
import LiveTimer from './LiveTimer';
import AssignmentReason from './AssignmentReason';

const timelineIcons = {
  created: Zap,
  assigned: UserPlus,
  notified: Bell,
  accepted: CheckCircle2,
  contacted: Phone,
  reassigned: RefreshCw,
  sla_warning: AlertTriangle,
};

const timelineColors = {
  created: 'bg-ar-gray-100 text-ar-gray-600 ring-ar-gray-50',
  assigned: 'bg-ar-steel-light text-ar-steel ring-ar-steel-light',
  notified: 'bg-ar-warn-light text-ar-warn ring-ar-warn-light',
  accepted: 'bg-ar-ok-light text-ar-ok ring-ar-ok-light',
  contacted: 'bg-ar-violet-light text-ar-violet ring-ar-violet-light',
  reassigned: 'bg-ar-coral-light text-ar-coral ring-ar-coral-light',
  sla_warning: 'bg-ar-crit-light text-ar-crit ring-ar-crit-light',
};

const statusConfig = {
  nuevo: { label: 'Nuevo', bg: 'bg-ar-gray-100', text: 'text-ar-gray-600' },
  asignado: { label: 'Asignado', bg: 'bg-ar-steel-light', text: 'text-ar-steel' },
  aceptado: { label: 'Aceptado', bg: 'bg-ar-ok-light', text: 'text-ar-ok' },
  contactado: { label: 'Contactado', bg: 'bg-ar-gray-100', text: 'text-ar-gray-500' },
};

function formatDate(date) {
  if (!date) return '\u2014';
  const d = new Date(date);
  return d.toLocaleString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function LeadDetailModal({ lead, sellers, onClose, onReassign, onMarkContacted }) {
  if (!lead) return null;

  const seller = lead.sellerId ? sellers.find(s => s.id === lead.sellerId) : null;
  const status = statusConfig[lead.status];
  const history = lead.reassignmentHistory || [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-ar-slate-900/25 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg h-full bg-white shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()} style={{ animation: 'slideIn 0.25s ease-out' }}>

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-ar-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-ar-gray-800">{lead.name}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-ar-gray-400 font-mono">{lead.id}</span>
              <span className="text-ar-gray-300">&middot;</span>
              <LiveTimer date={lead.assignedAt || lead.createdAt} sla={lead.sla} />
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-ar-gray-100 text-ar-gray-400 hover:text-ar-gray-600 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center px-3 py-1.5 rounded text-xs font-semibold ${status.bg} ${status.text}`}>
              {status.label}
            </span>
            {lead.sla === 'vencido' && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-ar-crit-light text-ar-crit ring-1 ring-ar-crit/20 animate-pulse">
                <Clock className="w-3 h-3" />SLA Vencido
              </span>
            )}
            {lead.sla === 'atencion' && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-ar-warn-light text-amber-800 ring-1 ring-ar-warn/20">
                <AlertTriangle className="w-3 h-3" />SLA en riesgo
              </span>
            )}
            {lead.reassignments > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-ar-crit-light text-ar-crit">
                <RefreshCw className="w-3 h-3" />{lead.reassignments} reasignaciones
              </span>
            )}
          </div>

          {/* Contact info */}
          <div className="bg-ar-gray-50 rounded-lg p-5 space-y-3">
            <h3 className="text-[10px] font-bold text-ar-gray-400 uppercase tracking-wider">Informacion de contacto</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Mail, label: 'Email', value: lead.email },
                { icon: Phone, label: 'Telefono', value: lead.phone },
                { icon: MapPin, label: 'Ciudad / Region', value: lead.city + ', ' + lead.region },
                { icon: MessageSquare, label: 'Canal', value: lead.channel },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-white border border-ar-gray-200"><item.icon className="w-3.5 h-3.5 text-ar-gray-500" /></div>
                  <div>
                    <p className="text-[10px] text-ar-gray-400">{item.label}</p>
                    <p className="text-sm text-ar-gray-800">{item.value}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2.5 col-span-2">
                <div className="p-2 rounded-lg bg-white border border-ar-gray-200"><Package className="w-3.5 h-3.5 text-ar-gray-500" /></div>
                <div>
                  <p className="text-[10px] text-ar-gray-400">Equipo interesado</p>
                  <p className="text-sm font-medium text-ar-gray-800">{lead.product}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned seller */}
          {seller && (
            <div className="bg-ar-gray-50 rounded-lg p-5">
              <h3 className="text-[10px] font-bold text-ar-gray-400 uppercase tracking-wider mb-3">Vendedor asignado</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-ar-steel to-ar-violet flex items-center justify-center text-white font-bold">
                  {seller.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ar-gray-800">{seller.name}</p>
                  <p className="text-xs text-ar-gray-400">{seller.email} &middot; {seller.region}</p>
                </div>
              </div>
            </div>
          )}

          {/* Assignment Reason */}
          {lead.assignmentReason && <AssignmentReason reason={lead.assignmentReason} />}

          {/* Reassignment History */}
          {history.length > 1 && (
            <div className="bg-ar-crit-light/50 rounded-lg p-5 border border-ar-crit/10">
              <div className="flex items-center gap-2 mb-3">
                <RefreshCw className="w-4 h-4 text-ar-crit" />
                <h3 className="text-[10px] font-bold text-ar-gray-600 uppercase tracking-wider">Historial de reasignaciones</h3>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {history.map((h, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-white border border-ar-gray-200">
                      <div className="w-5 h-5 rounded bg-gradient-to-br from-ar-steel to-ar-violet flex items-center justify-center text-[9px] font-bold text-white">
                        {h.sellerName.charAt(0)}
                      </div>
                      <span className="text-xs font-medium text-ar-gray-700">{h.sellerName.split(' ')[0]}</span>
                    </div>
                    {i < history.length - 1 && <span className="text-ar-gray-300 text-lg">&rarr;</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="text-[10px] font-bold text-ar-gray-400 uppercase tracking-wider mb-4">Timeline de eventos</h3>
            <div className="relative">
              <div className="absolute left-[17px] top-2 bottom-2 w-px bg-ar-gray-200" />
              <div className="space-y-3">
                {lead.timeline.map((event, i) => {
                  const Icon = timelineIcons[event.icon] || Zap;
                  const colors = timelineColors[event.icon] || 'bg-ar-gray-100 text-ar-gray-600 ring-ar-gray-50';
                  const isCritical = event.icon === 'sla_warning' || event.icon === 'reassigned';
                  return (
                    <div key={i} className={`flex items-start gap-3 relative ${isCritical ? 'py-1' : ''}`}>
                      <div className={`p-1.5 rounded-lg ${colors} ring-4 z-10`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="pt-0.5 min-w-0">
                        <p className={`text-sm font-medium ${isCritical ? 'text-ar-crit' : 'text-ar-gray-700'}`}>{event.event}</p>
                        <p className="text-[11px] text-ar-gray-400">{formatDate(event.time)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button onClick={() => onReassign(lead.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-ar-gray-200 text-sm font-medium text-ar-gray-700 hover:bg-ar-gray-50 hover:border-ar-gray-300 transition-all cursor-pointer">
              <RefreshCw className="w-4 h-4" />Reasignar
            </button>
            <button onClick={() => onMarkContacted(lead.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-ar-steel text-sm font-medium text-white hover:bg-ar-steel-dark transition-all cursor-pointer shadow-sm">
              <Phone className="w-4 h-4" />Contactado
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}