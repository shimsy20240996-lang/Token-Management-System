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
