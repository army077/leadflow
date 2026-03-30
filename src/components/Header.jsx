import { Bell, Search, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-14 bg-white border-b border-ar-gray-200/80 flex items-center justify-between px-8 sticky top-0 z-20">
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative flex items-center w-full">
          <Search className="absolute left-3 w-4 h-4 text-ar-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar leads, vendedores..."
            className="w-full pl-10 pr-4 py-2 bg-ar-gray-50 border border-ar-gray-200 rounded-lg text-sm text-ar-gray-700 placeholder:text-ar-gray-400 focus:outline-none focus:ring-2 focus:ring-ar-steel/15 focus:border-ar-steel/30 transition-all"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg text-ar-gray-400 hover:bg-ar-gray-50 hover:text-ar-gray-600 transition-colors cursor-pointer">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-ar-coral rounded-full ring-2 ring-white" />
        </button>

        <div className="w-px h-7 bg-ar-gray-200 mx-2" />

        <button className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg hover:bg-ar-gray-50 transition-colors cursor-pointer">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-ar-steel to-ar-violet flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium text-ar-gray-700 leading-tight">Admin</p>
            <p className="text-[11px] text-ar-gray-400 leading-tight">admin@asiarobotica.com</p>
          </div>
        </button>
      </div>
    </header>
  );
}
