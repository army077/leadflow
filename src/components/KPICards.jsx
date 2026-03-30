import { TrendingUp, TrendingDown, Minus, Zap, UserCheck, Clock, Timer, RefreshCw } from 'lucide-react';

function KPICard({ title, value, subtitle, trend, icon: Icon, color }) {
  const colorMap = {
    steel: {
      icon: 'bg-ar-steel-light text-ar-steel',
      accent: 'text-ar-steel',
    },
    green: {
      icon: 'bg-ar-ok-light text-ar-ok',
      accent: 'text-ar-ok',
    },
    amber: {
      icon: 'bg-ar-warn-light text-ar-warn',
      accent: 'text-ar-warn',
    },
    violet: {
      icon: 'bg-ar-violet-light text-ar-violet',
      accent: 'text-ar-violet',
    },
    coral: {
      icon: 'bg-ar-coral-light text-ar-coral',
      accent: 'text-ar-coral',
    },
  };

  const colors = colorMap[color] || colorMap.steel;

  return (
    <div className="bg-white rounded-xl border border-ar-gray-200/80 p-5 hover:shadow-md hover:border-ar-gray-300/80 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${colors.icon} transition-transform duration-200 group-hover:scale-105`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[11px] font-semibold ${
            trend > 0 ? 'text-ar-ok' : trend < 0 ? 'text-ar-crit' : 'text-ar-gray-400'
          }`}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : trend < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div>
        <h3 className={`text-2xl font-bold tracking-tight tabular-nums ${colors.accent}`}>{value}</h3>
        <p className="text-xs font-medium text-ar-gray-500 mt-1 uppercase tracking-wide">{title}</p>
        {subtitle && (
          <p className="text-[11px] text-ar-gray-400 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

export default function KPICards({ leads }) {
  const today = leads.length;
  const assigned = leads.filter(l => l.status === 'asignado' || l.status === 'aceptado' || l.status === 'contactado').length;
  const pending = leads.filter(l => l.status === 'asignado').length;
  const reassigned = leads.reduce((sum, l) => sum + l.reassignments, 0);

  const acceptedLeads = leads.filter(l => l.acceptedAt && l.assignedAt);
  const avgTime = acceptedLeads.length > 0
    ? Math.round(acceptedLeads.reduce((sum, l) => {
        const diff = new Date(l.acceptedAt) - new Date(l.assignedAt);
        return sum + diff / (1000 * 60);
      }, 0) / acceptedLeads.length)
    : 18;

  const kpis = [
    { title: 'Leads hoy', value: today, subtitle: 'Total recibidos', trend: 12, icon: Zap, color: 'steel' },
    { title: 'Asignados', value: assigned, subtitle: 'Con vendedor', trend: 8, icon: UserCheck, color: 'green' },
    { title: 'Pendientes', value: pending, subtitle: 'Sin aceptar', trend: -5, icon: Clock, color: 'amber' },
    { title: 'T. promedio', value: `${avgTime}m`, subtitle: 'De aceptación', trend: -3, icon: Timer, color: 'violet' },
    { title: 'Reasignaciones', value: reassigned, subtitle: 'Total hoy', trend: 0, icon: RefreshCw, color: 'coral' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpis.map((kpi, i) => (
        <KPICard key={i} {...kpi} />
      ))}
    </div>
  );
}
