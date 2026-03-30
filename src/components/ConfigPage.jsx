import { useState } from 'react';
import { Settings, Clock, Bell, Shield, Database } from 'lucide-react';

export default function ConfigPage() {
  const inputClass = "w-full px-4 py-2.5 bg-ar-gray-50 border border-ar-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ar-steel/15 focus:border-ar-steel/30";
  const [toggles, setToggles] = useState([true, true, true, false]);

  const handleToggle = (index) => {
    setToggles(prev => prev.map((v, i) => i === index ? !v : v));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-ar-slate-900 tracking-tight">Configuración</h2>
        <p className="text-sm text-ar-gray-400 mt-1">Ajustes del sistema de asignación</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SLA Config */}
        <div className="bg-white rounded-xl border border-ar-gray-200/80 p-6 hover:shadow-sm transition-all">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-lg bg-ar-warn/10 text-ar-warn">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ar-gray-800">SLA de aceptación</h3>
              <p className="text-xs text-ar-gray-400">Tiempo máximo para aceptar un lead</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-ar-gray-500 mb-1.5 uppercase tracking-wide">Tiempo de atención (minutos)</label>
              <input type="number" defaultValue={30} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-ar-gray-500 mb-1.5 uppercase tracking-wide">SLA vencido (minutos)</label>
              <input type="number" defaultValue={60} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-ar-gray-200/80 p-6 hover:shadow-sm transition-all">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-lg bg-ar-steel-light text-ar-steel">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ar-gray-800">Notificaciones</h3>
              <p className="text-xs text-ar-gray-400">Alertas y recordatorios</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              'Notificar al vendedor al asignar lead',
              'Alerta de SLA próximo a vencer',
              'Notificar reasignación automática',
              'Resumen diario por email',
            ].map((label, i) => (
              <div key={i} className="flex items-center justify-between py-2 cursor-pointer group" onClick={() => handleToggle(i)}>
                <span className="text-sm text-ar-gray-600 group-hover:text-ar-gray-800 transition-colors">{label}</span>
                <div
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${toggles[i] ? 'bg-ar-steel' : 'bg-ar-gray-200'}`}
                >
                  <div
                    className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${toggles[i] ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assignment rules */}
        <div className="bg-white rounded-xl border border-ar-gray-200/80 p-6 hover:shadow-sm transition-all">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-lg bg-ar-violet-light text-ar-violet">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ar-gray-800">Reglas de asignación</h3>
              <p className="text-xs text-ar-gray-400">Lógica de distribución automática</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-ar-gray-500 mb-1.5 uppercase tracking-wide">Prioridad de asignación</label>
              <select className={inputClass + " appearance-none"}>
                <option>Misma región + menor carga</option>
                <option>Menor carga global</option>
                <option>Round robin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-ar-gray-500 mb-1.5 uppercase tracking-wide">Máximo leads por vendedor</label>
              <input type="number" defaultValue={8} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-ar-gray-500 mb-1.5 uppercase tracking-wide">Auto-reasignar después de (minutos)</label>
              <input type="number" defaultValue={90} className={inputClass} />
            </div>
          </div>
        </div>

        {/* System */}
        <div className="bg-white rounded-xl border border-ar-gray-200/80 p-6 hover:shadow-sm transition-all">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-lg bg-ar-gray-100 text-ar-gray-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ar-gray-800">Sistema</h3>
              <p className="text-xs text-ar-gray-400">Información del sistema</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {[
              ['Versión', 'v1.0.0-beta'],
              ['Entorno', 'Desarrollo (Mock)'],
              ['Última sync.', 'Ahora'],
              ['Motor', 'React + Vite'],
            ].map(([label, value], i) => (
              <div key={i} className="flex items-center justify-between py-1.5">
                <span className="text-sm text-ar-gray-500">{label}</span>
                <span className="text-sm font-semibold text-ar-gray-800 font-mono">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
