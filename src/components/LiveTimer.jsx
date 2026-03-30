import { useState, useEffect } from 'react';

export default function LiveTimer({ date, sla }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  if (!date) return <span className="text-xs text-ar-gray-300">—</span>;

  const now = Date.now();
  const diffSec = Math.floor((now - new Date(date).getTime()) / 1000);
  const mins = Math.floor(diffSec / 60);

  let display;
  if (mins < 60) {
    display = `${mins}m`;
  } else {
    const hrs = Math.floor(mins / 60);
    const remainMins = mins % 60;
    display = `${hrs}h ${remainMins}m`;
  }

  const colorClass =
    sla === 'vencido'
      ? 'text-ar-crit font-semibold'
      : sla === 'atencion'
      ? 'text-ar-warn font-medium'
      : 'text-ar-slate-500';

  return (
    <span className={`text-sm tabular-nums tracking-tight font-mono transition-colors duration-500 ${colorClass}`}>
      {display}
    </span>
  );
}