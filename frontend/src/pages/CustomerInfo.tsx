import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, User, Phone } from 'lucide-react';

export default function CustomerInfo() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if we already have session data to pre-fill
    const savedName = sessionStorage.getItem('customerName');
    const savedPhone = sessionStorage.getItem('customerPhone');
    if (savedName) setName(savedName);
    if (savedPhone) setPhone(savedPhone);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError(t('Name is required.'));
      return;
    }
    const phoneRegex = /^(?:0|(?:\+94))[0-9]{9}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      setError(t('Please enter a valid mobile number.'));
      return;
    }

    setIsSubmitting(true);
    sessionStorage.setItem('customerName', name);
    sessionStorage.setItem('customerPhone', phone);
    
    setTimeout(() => {
      navigate('/services');
    }, 400); // small delay for animation
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md animate-slide-up">
        
        <button 
          onClick={() => navigate(-1)} 
          className="mb-8 flex items-center text-[#64748B] hover:text-[#17233A] transition-colors group text-sm font-semibold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          {t('Back')}
        </button>

        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-[#17233A] mb-3 tracking-tight">{t('Tell us about you')}</h1>
          <p className="text-[#64748B]">{t('Enter your details to receive your digital token.')}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5 group relative">
            <label className="block text-sm font-semibold text-[#17233A]">
              {t('Full Name')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-[#64748B] group-focus-within:text-blue-600 transition-colors" />
              </div>
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 rounded-[16px] border border-slate-200 bg-white shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all text-[#17233A] font-medium text-lg placeholder:font-normal placeholder:text-slate-400"
                placeholder={t('Enter Your Name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5 group relative">
            <label className="block text-sm font-semibold text-[#17233A]">
              {t('Mobile Number')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-[#64748B] group-focus-within:text-blue-600 transition-colors" />
              </div>
              <input
                type="tel"
                className="w-full pl-12 pr-4 py-4 rounded-[16px] border border-slate-200 bg-white shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all text-[#17233A] font-medium text-lg tracking-wide placeholder:font-normal placeholder:text-slate-400"
                placeholder="07X XXX XXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="animate-fade-in p-4 rounded-xl bg-red-50 border border-red-100 flex items-center text-red-600 text-sm font-semibold">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white font-bold py-4 rounded-[16px] text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:active:scale-100 mt-4 group"
          >
            {isSubmitting ? (
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                {t('CONTINUE')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
