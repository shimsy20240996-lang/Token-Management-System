import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { LogOut } from 'lucide-react';

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [selectedCounter, setSelectedCounter] = useState<any>(null);

  // Quick check auth
  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const { data: counters, isLoading: loadingCounters } = useQuery({
    queryKey: ['counters'],
    queryFn: async () => {
      const res = await api.get('/counters');
      return res.data;
    }
  });

  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats');
      return res.data;
    },
    refetchInterval: 5000,
  });

  const [servingToken, setServingToken] = useState<any>(null);

  const handleCallNext = async () => {
    if (!selectedCounter) return alert('Select a counter first');
    try {
      const res = await api.post('/dashboard/call-next', {
        counterId: selectedCounter.id,
        serviceId: selectedCounter.serviceId
      });
      if (res.data.message) {
        alert(res.data.message); // Queue is empty
        setServingToken(null);
      } else {
        setServingToken(res.data);
      }
      refetchStats();
    } catch (error) {
      console.error(error);
      alert('Error calling next token');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Staff Dashboard</h1>
        <button onClick={handleLogout} className="flex items-center text-slate-600 hover:text-slate-900 font-medium">
          <LogOut className="w-5 h-5 mr-2" /> Logout
        </button>
      </nav>

      <div className="flex-1 p-8 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Col - Settings */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Select Counter</h3>
            {loadingCounters ? (
              <div>Loading...</div>
            ) : (
              <select 
                className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:border-blue-500 bg-slate-50"
                value={selectedCounter?.id || ''}
                onChange={(e) => {
                  const c = counters.find((c: any) => c.id === e.target.value);
                  setSelectedCounter(c);
                }}
              >
                <option value="" disabled>Select your counter</option>
                {counters?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.service.name})</option>
                ))}
              </select>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Today's Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-slate-600">Total Customers</span>
                <span className="font-bold text-slate-800">{stats?.totalToday || 0}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-slate-600">Waiting</span>
                <span className="font-bold text-blue-600">{stats?.waiting || 0}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-slate-600">Completed</span>
                <span className="font-bold text-green-600">{stats?.completed || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col - Controls */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col p-8">
            <div className="text-center flex-1 flex flex-col justify-center items-center">
              <h2 className="text-lg font-medium text-slate-500 mb-2">Currently Serving</h2>
              {servingToken ? (
                <>
                  <div className="text-7xl font-black text-slate-800 mb-4">{servingToken.tokenNumber}</div>
                  <div className="text-xl font-medium text-slate-600 mb-1">{servingToken.customer?.name}</div>
                  <div className="text-sm text-slate-400 mb-8">{servingToken.customer?.phoneNumber}</div>
                </>
              ) : (
                <div className="text-2xl font-medium text-slate-400 mb-8 py-10">No active token</div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto">
              <button 
                onClick={handleCallNext}
                disabled={!selectedCounter}
                className="col-span-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xl font-bold py-6 rounded-xl transition-all shadow-md"
              >
                CALL NEXT
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
