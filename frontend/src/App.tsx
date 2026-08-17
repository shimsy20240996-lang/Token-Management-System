import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from './pages/LandingPage';
import LanguageSelect from './pages/LanguageSelect';
import CustomerInfo from './pages/CustomerInfo';
import ServiceSelect from './pages/ServiceSelect';
import TokenTracking from './pages/TokenTracking';
import QueueDisplay from './pages/QueueDisplay';
import AdminLogin from './pages/admin/AdminLogin';
import StaffDashboard from './pages/admin/StaffDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Enterprise Telecom Brand Header Background */}
      <div className="fixed top-0 left-0 right-0 h-[45vh] bg-gradient-to-br from-[#0b1f51] via-[#1d4ed8] to-[#06b6d4] -z-10" 
           style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0% 100%)' }}>
      </div>
      <div className="fixed inset-0 bg-slate-50 -z-20"></div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/language" element={<LanguageSelect />} />
          <Route path="/customer" element={<CustomerInfo />} />
          <Route path="/services" element={<ServiceSelect />} />
          <Route path="/queue/:tokenNumber" element={<TokenTracking />} />
          <Route path="/display" element={<QueueDisplay />} />
          
          {/* Admin / Staff */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<StaffDashboard />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
