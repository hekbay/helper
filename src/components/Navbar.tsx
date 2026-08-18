import React from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Users, Shield, QrCode, RefreshCw } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { userSession, logout, attendees, resetToDefault } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // If on public badge page, DO NOT render navbar
  if (location.pathname.startsWith('/badge/')) {
    return null;
  }

  const presentCount = attendees.filter(a => a.isPresent).length;
  const vipCount = attendees.filter(a => a.level === 'VIP').length;
  const vipPresentCount = attendees.filter(a => a.level === 'VIP' && a.isPresent).length;
  const espCount = attendees.filter(a => a.level === 'ESPECIAL').length;
  const espPresentCount = attendees.filter(a => a.level === 'ESPECIAL' && a.isPresent).length;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-base shadow-sm">
            H
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-slate-900 tracking-tight">HELPER</h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                Imersão Rise
              </span>
            </div>
            <p className="text-xs text-slate-500">Teacher Ana de Araújo • Barueri/SP</p>
          </div>
        </div>

        {/* Live Event Counter Stats */}
        <div className="hidden md:flex items-center space-x-4 bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-lg text-xs">
          <div className="text-slate-700 font-medium">
            Presença: <strong className="text-emerald-700 font-bold">{presentCount}/{attendees.length}</strong>
          </div>
          <div className="w-px h-3.5 bg-slate-300" />
          <div className="text-slate-700 font-medium">
            VIPs: <strong className="text-amber-800 font-bold">{vipPresentCount}/{vipCount}</strong>
          </div>
          <div className="w-px h-3.5 bg-slate-300" />
          <div className="text-slate-700 font-medium">
            Especial: <strong className="text-blue-800 font-bold">{espPresentCount}/{espCount}</strong>
          </div>
        </div>

        {/* User Session & Actions */}
        <div className="flex items-center space-x-3">
          {userSession.role ? (
            <>
              {/* Navigation tabs */}
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                <button
                  onClick={() => navigate('/closers')}
                  className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 font-medium transition ${
                    location.pathname === '/closers'
                      ? 'bg-white text-slate-900 font-bold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Closers</span>
                </button>

                <button
                  onClick={() => navigate('/recepcao')}
                  className={`px-3 py-1.5 rounded-md flex items-center space-x-1.5 font-medium transition ${
                    location.pathname === '/recepcao'
                      ? 'bg-white text-slate-900 font-bold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Recepção</span>
                </button>
              </div>

              {/* Demo QR Scanner link */}
              <button
                onClick={() => {
                  const randomAttendee = attendees[Math.floor(Math.random() * attendees.length)];
                  if (randomAttendee) {
                    navigate(`/badge/${randomAttendee.id}`);
                  }
                }}
                className="hidden sm:flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-2.5 py-1.5 rounded-md shadow-sm transition"
                title="Testar visualização pública do Crachá QR Code"
              >
                <QrCode className="w-3.5 h-3.5 text-blue-600" />
                <span>Testar QR</span>
              </button>

              {/* Logout button */}
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="flex items-center space-x-1 text-xs text-slate-600 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-md transition font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition"
            >
              Fazer Login
            </button>
          )}

          {/* Reset Data button */}
          <button
            onClick={() => {
              if (confirm('Deseja restaurar os dados iniciais do evento?')) {
                resetToDefault();
              }
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 transition rounded-md hover:bg-slate-100"
            title="Restaurar dados iniciais"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
