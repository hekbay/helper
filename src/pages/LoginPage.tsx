import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, KeyRound, ArrowRight, CheckCircle } from 'lucide-react';
import type { UserRole } from '../types/index';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('CLOSER');
  const [pin, setPin] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedRole === 'CLOSER') {
      if (pin && pin !== '102030' && pin !== '1234') {
        setError('PIN incorreto para Closers! (PIN correto: 102030)');
        return;
      }
      login('CLOSER', userName || 'Closer Rise');
      navigate('/closers');
    } else if (selectedRole === 'RECEPCAO') {
      if (pin && pin !== '5555' && pin !== '555') {
        setError('PIN incorreto para Recepção! (PIN correto: 5555)');
        return;
      }
      login('RECEPCAO', userName || 'Equipe Recepção');
      navigate('/recepcao');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-6 bg-slate-50">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white font-black text-xl shadow-sm mb-3">
            H
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Imersão Rise • Barueri
          </h1>
          <p className="text-xs text-slate-500 mt-1">
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
                  onClick={() => setSelectedRole('RECEPCAO')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition min-h-[72px] ${
                    selectedRole === 'RECEPCAO'
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Shield className={`w-4 h-4 ${selectedRole === 'RECEPCAO' ? 'text-white' : 'text-slate-500'}`} />
                    {selectedRole === 'RECEPCAO' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold">RECEPÇÃO</div>
                    <div className={`text-[10px] ${selectedRole === 'RECEPCAO' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Credenciamento
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {selectedRole === 'CLOSER' ? 'Seu Nome (para anotações)' : 'Nome do Atendente'}
              </label>
              <input
                type="text"
                placeholder={selectedRole === 'CLOSER' ? 'Ex: Closer Lucas' : 'Ex: Atendente Ana'}
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition"
              />
            </div>

            {/* PIN Security Code */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  PIN de Acesso
                </label>
                <span className="text-[11px] text-slate-500 font-mono font-bold">
                  {selectedRole === 'CLOSER' ? 'PIN: 102030' : 'PIN: 5555'}
                </span>
              </div>
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
              <span>Acessar {selectedRole === 'CLOSER' ? 'Painel dos Closers' : 'Painel da Recepção'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
