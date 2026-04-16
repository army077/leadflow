import { useState, useMemo, useEffect} from 'react';
import Layout from './components/Layout';
import DashboardPage from './components/DashboardPage';
import LeadsPage from './components/LeadsPage';
import SellersTable from './components/SellersTable';
import SellerDetailPage from './components/SellerDetailPage';
import ConfigPage from './components/ConfigPage';
import LeadDetailModal from './components/LeadDetailModal';
import { generateLeads, sellers as initialSellers, assignLeadsToSellers, computeAssignmentReason } from './data/mockData';
import { fetchLeads, fetchVendors } from './services/api';
import { normalizeLead, normalizeVendor } from './utils/normalizers';

const initialData = (() => {
  const rawLeads = generateLeads(28);
  return assignLeadsToSellers(rawLeads, initialSellers);
})();

function App() {
  const [page, setPage] = useState('dashboard');
  const [leads, setLeads] = useState(initialData.leads);
  const [sellers, setSellers] = useState(initialData.sellers);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
    const [leadsData, setLeadsData] = useState([]);
  const [sellersData, setSellersData] = useState([]);
  useEffect(() => {
    const load = async () => {
      try {
        const [rawLeads, rawVendors] = await Promise.all([fetchLeads(), fetchVendors()]);
        setLeadsData(rawLeads.map(normalizeLead));
        setSellersData(rawVendors.map(normalizeVendor));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    load();
  }, []);

  const handleReassign = (leadId) => {
    setLeads(prev => {
      const lead = prev.find(l => l.id === leadId);
      if (!lead) return prev;

      const currentSellerId = lead.sellerId;
      const otherSellers = sellers.filter(s => s.id !== currentSellerId && s.status === 'activo');
      if (otherSellers.length === 0) return prev;

      const newSeller = otherSellers.reduce((best, s) => {
        const bestLoad = prev.filter(l => l.sellerId === best.id).length;
        const sLoad = prev.filter(l => l.sellerId === s.id).length;
        return sLoad < bestLoad ? s : best;
      }, otherSellers[0]);

      const now = new Date();
      const sellerLoad = {};
      sellers.forEach(s => { sellerLoad[s.id] = prev.filter(ll => ll.sellerId === s.id).length; });
      const reason = computeAssignmentReason(lead, newSeller, sellerLoad, sellers);
      reason.method = 'reasignacion_auto';

      const prevHistory = lead.reassignmentHistory || [];
      const newHistory = [...prevHistory];
      if (newHistory.length === 0 && lead.sellerId) {
        const oldSeller = sellers.find(s => s.id === lead.sellerId);
        if (oldSeller) newHistory.push({ sellerName: oldSeller.name, sellerId: oldSeller.id });
      }
      newHistory.push({ sellerName: newSeller.name, sellerId: newSeller.id });

      return prev.map(l =>
        l.id === leadId
          ? {
              ...l,
              sellerId: newSeller.id,
              status: 'asignado',
              reassignments: l.reassignments + 1,
              assignedAt: now,
              assignmentReason: reason,
              reassignmentHistory: newHistory,
              timeline: [
                ...l.timeline,
                { event: `Reasignado a ${newSeller.name}`, time: now, icon: 'reassigned' },
                { event: 'Notificacion enviada', time: new Date(now.getTime() + 1000 * 30), icon: 'notified' },
              ],
            }
          : l
      );
    });
    setSelectedLead(null);
  };

  const handleMarkContacted = (leadId) => {
    const now = new Date();
    setLeads(prev =>
      prev.map(l =>
        l.id === leadId
          ? {
              ...l,
              status: 'contactado',
              timeline: [
                ...l.timeline,
                { event: 'Lead contactado', time: now, icon: 'contacted' },
              ],
            }
          : l
      )
    );
    setSelectedLead(null);
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <DashboardPage leads={leadsData} sellers={sellersData} onSelectLead={setSelectedLead} />;
      case 'leads':
        return <LeadsPage leads={leadsData} sellers={sellersData} onSelectLead={setSelectedLead} />;
      case 'sellers':
        return selectedSeller
          ? <SellerDetailPage seller={selectedSeller} leads={leads} onBack={() => setSelectedSeller(null)} onSelectLead={setSelectedLead} />
          : <SellersTable sellers={sellersData} leads={leadsData} onSelectSeller={setSelectedSeller} />;
      case 'config':
        return <ConfigPage />;
      default:
        return <DashboardPage leads={leadsData} sellers={sellersData} onSelectLead={setSelectedLead} />;
    }
  };

  return (
    <>
      <Layout activePage={page} onNavigate={setPage}>
        {renderPage()}
      </Layout>

      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          sellers={sellers}
          onClose={() => setSelectedLead(null)}
          onReassign={handleReassign}
          onMarkContacted={handleMarkContacted}
        />
      )}
    </>
  );
}

export default App;
