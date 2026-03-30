import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ activePage, onNavigate, children }) {
  return (
    <div className="min-h-screen bg-ar-gray-100">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <div className="ml-[260px] transition-all duration-300">
        <Header />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
