import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, KeyRound, ArrowRight, CheckCircle, ChevronDown, UserCircle2 } from 'lucide-react';
import type { UserRole } from '../types/index';

export const LoginPage: React.FC = () => {
  const { login, closerNames } = useApp();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('CLOSER');
  const [pin, setPin] = useState('');
  const [closerName, setCloserName] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [isNameDropdownOpen, setIsNameDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsNameDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const CLOSER_PIN = import.meta.env.VITE_CLOSER_PIN;
  const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!pin) {
      setError('Digite o PIN de acesso.');
      return;
    }

    if (selectedRole === 'CLOSER') {
      if (!closerName) {
        setError('Selecione quem é você.');
        return;
      }
      if (pin !== CLOSER_PIN) {
        setError('PIN incorreto para o perfil de Closers! Tente novamente.');
        return;
      }
      login('CLOSER', closerName);
      navigate('/closers');
    } else if (selectedRole === 'ADMIN') {
      if (pin !== ADMIN_PIN) {
        setError('PIN incorreto para o perfil Admin! Tente novamente.');
        return;
      }
      login('ADMIN', userName || 'admin');
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-6 bg-slate-50">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Header Branding with Official Logo */}
        <div className="text-center mb-6">
          <img
            src="/logo-imersao-rise.png"
            alt="Imersão Rise • Teacher Ana de Araújo"
            className="h-16 sm:h-20 mx-auto object-contain mb-2"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://teacherana.com.br/wp-content/uploads/IMERSAO2026/imersao%20rise/assets/LOGO%20IMERSAO%20PNG.png";
            }}
          />
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            HELPER • Barueri/SP
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sistema de Inteligência para Closers & Credenciamento da Recepção
          </p>
        </div>

        {/* Card Login Form */}
        <div className="clean-card p-5 sm:p-7 rounded-2xl bg-white shadow-sm border border-slate-200">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                Perfil de Acesso
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedRole('CLOSER')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition min-h-[72px] ${
                    selectedRole === 'CLOSER'
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Users className={`w-4 h-4 ${selectedRole === 'CLOSER' ? 'text-white' : 'text-slate-500'}`} />
                    {selectedRole === 'CLOSER' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold">CLOSER</div>
                    <div className={`text-[10px] ${selectedRole === 'CLOSER' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Vendas & Intel
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('ADMIN')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition min-h-[72px] ${
                    selectedRole === 'ADMIN'
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <ShieldCheck className={`w-4 h-4 ${selectedRole === 'ADMIN' ? 'text-white' : 'text-slate-500'}`} />
                    {selectedRole === 'ADMIN' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold">ADMIN</div>
                    <div className={`text-[10px] ${selectedRole === 'ADMIN' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Administração
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Name Selection */}
            {selectedRole === 'CLOSER' ? (
              <div ref={dropdownRef} className="relative">
                <label className="block text-xs font-bold text-slate-700 mb-1">Quem é você?</label>
                <button
                  type="button"
                  onClick={() => setIsNameDropdownOpen(prev => !prev)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-left focus:outline-none focus:border-slate-900 focus:bg-white transition flex items-center justify-between"
                >
                  <span className={closerName ? 'text-slate-900 font-semibold' : 'text-slate-400'}>
                    {closerName || 'Selecione seu nome'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${isNameDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <UserCircle2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-[38px] pointer-events-none" />

                {isNameDropdownOpen && (
                  <div className="absolute z-10 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                    {closerNames.map(name => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => {
                          setCloserName(name);
                          setIsNameDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-medium transition flex items-center justify-between ${
                          closerName === name
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{name}</span>
                        {closerName === name && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Administrador</label>
                <input
                  type="text"
                  placeholder="Ex: admin"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition"
                />
              </div>
            )}

            {/* PIN Security Code */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                PIN de Acesso
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••"
                  maxLength={8}
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-3 pl-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition tracking-widest"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center space-x-2 transition shadow-sm"
            >
              <span>Acessar {selectedRole === 'CLOSER' ? 'Painel dos Closers' : 'Painel Admin'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
