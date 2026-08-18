import React from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Users, Shield, QrCode, CheckCircle2 } from 'lucide-react';
import { getBadgeLevel } from '../types/index';

export const Navbar: React.FC = () => {
  const { userSession, logout, attendees } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname.startsWith('/badge/')) {
    return null;
  }

  const presentCount = attendees.filter(a => a.isPresent).length;
  const vipBadgePresent = attendees.filter(a => getBadgeLevel(a) === 'VIP' && a.isPresent).length;
  const vipBadgeTotal = attendees.filter(a => getBadgeLevel(a) === 'VIP').length;
  const espBadgePresent = attendees.filter(a => getBadgeLevel(a) === 'ESPECIAL' && a.isPresent).length;
  const espBadgeTotal = attendees.filter(a => getBadgeLevel(a) === 'ESPECIAL').length;

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-2 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Official Logo & Brand */}
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <img
              src="/logo-imersao-rise.png"
              alt="Imersão Rise"
              className="h-8 sm:h-9 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://teacherana.com.br/wp-content/uploads/IMERSAO2026/imersao%20rise/assets/LOGO%20IMERSAO%20PNG.png";
              }}
            />
            <div className="hidden sm:block border-l border-slate-300 pl-2.5">
              <h1 className="text-xs font-black text-slate-900 tracking-tight leading-none">HELPER</h1>
              <p className="text-[10px] text-slate-500 font-medium">Intel de Vendas</p>
            </div>
          </div>

          {/* Realtime Stats Pills */}
          <div className="flex items-center space-x-2 text-xs">
            <div className="flex items-center space-x-1.5 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 font-medium text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                Presença: <strong className="text-slate-900 font-bold">{presentCount}</strong>
                <span className="text-slate-400">/{attendees.length}</span>
              </span>
            </div>

            <div className="hidden lg:flex items-center space-x-2 text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
              <span>VIPs: <strong className="text-amber-800">{vipBadgePresent}/{vipBadgeTotal}</strong></span>
              <span className="text-slate-300">•</span>
              <span>Especial: <strong className="text-blue-800">{espBadgePresent}/{espBadgeTotal}</strong></span>
            </div>

            {userSession.role && (
              <>
                <button
                  onClick={() => {
                    const randomAttendee = attendees[Math.floor(Math.random() * attendees.length)];
                    if (randomAttendee) navigate(`/badge/${randomAttendee.id}`);
                  }}
                  className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-200 transition"
                  title="Testar QR Code"
                >
                  <QrCode className="w-4 h-4 text-blue-600" />
                </button>

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md border border-slate-200 transition"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      {userSession.role && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-around shadow-lg md:hidden">
          <button
            onClick={() => navigate('/closers')}
            className={`flex-1 py-2 rounded-lg flex flex-col items-center justify-center space-y-0.5 text-xs font-bold transition ${
              location.pathname === '/closers'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Closers</span>
          </button>

          <div className="w-3" />

          <button
            onClick={() => navigate('/recepcao')}
            className={`flex-1 py-2 rounded-lg flex flex-col items-center justify-center space-y-0.5 text-xs font-bold transition ${
              location.pathname === '/recepcao'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Recepção</span>
          </button>
        </nav>
      )}
    </>
  );
};
