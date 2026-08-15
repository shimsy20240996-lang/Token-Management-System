import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

export default function CustomerInfo() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t('Name is required.'));
      return;
    }
    // Sri Lanka phone basic validation
    const phoneRegex = /^(?:0|(?:\+94))[0-9]{9}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      setError(t('Please enter a valid mobile number.'));
      return;
    }

    sessionStorage.setItem('customerName', name);
    sessionStorage.setItem('customerPhone', phone);
    navigate('/services');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-slate-500 hover:text-slate-800">
          <ArrowLeft className="w-5 h-5 mr-1" />
          {t('Back')}
        </button>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('Full Name')}
            </label>
            <input
              type="text"
              className="w-full px-4 py-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg"
              placeholder={t('Enter Your Name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('Mobile Number')}
            </label>
            <input
              type="tel"
              className="w-full px-4 py-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg tracking-wide"
              placeholder="07X XXX XXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg transition-all"
          >
            {t('Continue')}
          </button>
        </form>
      </div>
    </div>
  );
}
