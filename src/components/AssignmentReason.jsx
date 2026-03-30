import { CheckCircle2, XCircle, MapPin, Package, BarChart3, Zap, Bot } from 'lucide-react';

export default function AssignmentReason({ reason, compact = false }) {
  if (!reason) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <Bot className="w-3 h-3 text-ar-gray-500" />
        <span className="text-[11px] font-semibold text-ar-gray-600">Score {reason.score}</span>
      </div>
    );
  }

  return (
    <div className="bg-ar-gray-50 rounded-lg p-5 border border-ar-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded bg-ar-steel">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-ar-gray-800 uppercase tracking-wider">Motor de asignación</h3>
          <p className="text-[10px] text-ar-gray-400">
            {reason.method === 'reasignacion_auto' ? 'Reasignación automática por SLA' : 'Asignación automática'}
          </p>
        </div>
        <div className="ml-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-ar-steel">
            <Zap className="w-3 h-3 text-amber-300" />
            <span className="text-sm font-bold text-white">{reason.score}</span>
            <span className="text-[10px] text-ar-gray-400 font-medium">/ 100</span>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-ar-gray-400" />
            <span className="text-sm text-ar-gray-600">Región compatible</span>
          </div>
          {reason.regionMatch ? (
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-ar-ok" />
              <span className="text-xs font-semibold text-ar-ok">Sí</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5 text-ar-crit" />
              <span className="text-xs font-semibold text-ar-crit">No</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-ar-gray-400" />
            <span className="text-sm text-ar-gray-600">Producto compatible</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-ar-ok" />
            <span className="text-xs font-semibold text-ar-ok">Sí</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5 text-ar-gray-400" />
            <span className="text-sm text-ar-gray-600">Carga actual</span>
          </div>
          <span className="text-xs font-semibold text-ar-gray-700">{reason.currentLoad} / {reason.maxLoad} leads</span>
        </div>

        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-ar-gray-400" />
            <span className="text-sm text-ar-gray-600">Prioridad de región</span>
          </div>
          <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded ${
            reason.regionPriority === 'alta' ? 'bg-ar-ok/10 text-ar-ok' : 'bg-ar-gray-100 text-ar-gray-500'
          }`}>{reason.regionPriority}</span>
        </div>
      </div>

      {/* Score bar */}
      <div className="mt-4 pt-3 border-t border-ar-gray-200">
        <div className="flex items-center justify-between text-[11px] text-ar-gray-400 mb-1.5">
          <span>Score de asignación</span>
          <span className="font-bold text-ar-gray-800">{reason.score}%</span>
        </div>
        <div className="h-1.5 bg-ar-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-ar-steel to-ar-violet transition-all duration-700"
            style={{ width: `${reason.score}%` }}
          />
        </div>
      </div>
    </div>
  );
}