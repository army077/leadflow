import { AlertTriangle, Clock, Users, XCircle, Shield } from 'lucide-react';

export default function AlertBanner({ leads, sellers }) {
  const slaVencido = leads.filter(l => l.sla === 'vencido' && l.status === 'asignado').length;
  const sinAceptar30 = leads.filter(l => {
    if (l.status !== 'asignado') return false;
    const mins = l.assignedAt ? Math.floor((Date.now() - new Date(l.assignedAt).getTime()) / 60000) : 0;
    return mins > 30;
  }).length;
  const nearSaturation = sellers.filter(s => {
    const load = leads.filter(l => l.sellerId === s.id && l.status !== 'contactado').length;
    return load >= s.maxLeads - 1;
  }).length;

  const alerts = [];

  if (slaVencido > 0) {
    alerts.push({
      icon: XCircle,
      label: `${slaVencido} lead${slaVencido > 1 ? 's' : ''} con SLA vencido`,
      severity: 'critical',
    });
  }
  if (sinAceptar30 > 0) {
    alerts.push({
      icon: Clock,
      label: `${sinAceptar30} lead${sinAceptar30 > 1 ? 's' : ''} sin aceptar > 30 min`,
      severity: 'warning',
    });
  }
  if (nearSaturation > 0) {
    alerts.push({
      icon: Users,
      label: `${nearSaturation} vendedor${nearSaturation > 1 ? 'es' : ''} cerca de saturación`,
      severity: 'info',
    });
  }

  if (alerts.length === 0) {
    return (
      <div className="flex items-center gap-3 px-5 py-3 bg-ar-ok-light border border-ar-ok/20 rounded-lg">
        <div className="p-1.5 rounded bg-ar-ok/10">
          <Shield className="w-4 h-4 text-ar-ok" />
        </div>
        <p className="text-sm font-medium text-ar-ok">Operación estable — todos los SLA en orden</p>
      </div>
    );
  }

  const hasCritical = alerts.some(a => a.severity === 'critical');

  return (
    <div className={`flex items-center gap-4 px-5 py-3 rounded-lg border transition-all ${
      hasCritical
        ? 'bg-ar-crit-light border-ar-crit/20'
        : 'bg-ar-warn-light border-ar-warn/20'
    }`}>
      <div className={`p-1.5 rounded ${hasCritical ? 'bg-ar-crit/10' : 'bg-ar-warn/10'}`}>
        <AlertTriangle className={`w-4 h-4 ${hasCritical ? 'text-ar-crit' : 'text-ar-warn'}`} />
      </div>

      <div className="flex items-center gap-4 flex-wrap flex-1 min-w-0">
        {alerts.map((alert, i) => {
          const Icon = alert.icon;
          return (
            <div key={i} className="flex items-center gap-2">
              <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${
                alert.severity === 'critical' ? 'text-ar-crit' :
                alert.severity === 'warning' ? 'text-ar-warn' : 'text-ar-gray-500'
              }`} />
              <span className={`text-sm font-medium whitespace-nowrap ${
                alert.severity === 'critical' ? 'text-ar-crit' :
                alert.severity === 'warning' ? 'text-amber-800' : 'text-ar-gray-700'
              }`}>
                {alert.label}
              </span>
              {i < alerts.length - 1 && (
                <span className="w-px h-4 bg-ar-gray-200 ml-2" />
              )}
            </div>
          );
        })}
      </div>

      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
        hasCritical ? 'bg-ar-crit/10 text-ar-crit' : 'bg-ar-warn/10 text-amber-800'
      }`}>
        {hasCritical ? 'Crítico' : 'Atención'}
      </span>
    </div>
  );
}
