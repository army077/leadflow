import { useMemo } from 'react';

function HorizontalBar({ label, value, total, color }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-ar-gray-500 w-20 text-right font-medium shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-ar-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-bold text-ar-gray-700 w-8 tabular-nums">{value}</span>
    </div>
  );
}

export default function MiniCharts({ leads }) {
  const byChannel = useMemo(() => {
    const map = {};
    leads.forEach(l => { map[l.channel] = (map[l.channel] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [leads]);

  const byRegion = useMemo(() => {
    const map = {};
    leads.forEach(l => { map[l.region] = (map[l.region] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [leads]);

  const maxChannel = byChannel.length > 0 ? byChannel[0][1] : 1;
  const maxRegion = byRegion.length > 0 ? byRegion[0][1] : 1;

  const channelColors = {
    WhatsApp: 'bg-ar-ok',
    Facebook: 'bg-ar-steel',
    Instagram: 'bg-ar-violet',
    Web: 'bg-ar-slate-500',
    Referido: 'bg-ar-coral',
  };

  const regionColors = {
    GDL: 'bg-ar-steel',
    CDMX: 'bg-ar-violet',
    MTY: 'bg-ar-ok',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl border border-ar-gray-200/80 p-5 hover:shadow-sm transition-all">
        <h4 className="text-[10px] font-bold text-ar-gray-400 uppercase tracking-wider mb-4">Leads por canal</h4>
        <div className="space-y-2.5">
          {byChannel.map(([channel, count]) => (
            <HorizontalBar
              key={channel}
              label={channel}
              value={count}
              total={maxChannel}
              color={channelColors[channel] || 'bg-ar-gray-400'}
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-ar-gray-200/80 p-5 hover:shadow-sm transition-all">
        <h4 className="text-[10px] font-bold text-ar-gray-400 uppercase tracking-wider mb-4">Leads por región</h4>
        <div className="space-y-2.5">
          {byRegion.map(([region, count]) => (
            <HorizontalBar
              key={region}
              label={region}
              value={count}
              total={maxRegion}
              color={regionColors[region] || 'bg-ar-gray-400'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
