import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BadgePill } from '../components/BadgePill';
import { Search, CheckCircle2, UserCheck, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RecepcaoPage: React.FC = () => {
  const { attendees, toggleCheckIn } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PRESENT' | 'ABSENT'>('ALL');

  const filteredAttendees = useMemo(() => {
    return attendees.filter(item => {
      const q = search.toLowerCase().trim();
      const matchesSearch = !q || item.name.toLowerCase().includes(q) || item.phone.includes(q);
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'PRESENT' && item.isPresent) ||
        (statusFilter === 'ABSENT' && !item.isPresent);

      return matchesSearch && matchesStatus;
    });
  }, [attendees, search, statusFilter]);

  const handleCheckInToggle = (id: string, currentlyPresent: boolean) => {
    toggleCheckIn(id);
    if (!currentlyPresent) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  const presentCount = attendees.filter(a => a.isPresent).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Reception Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Recepção & Credenciamento</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Controle de presença e entrega de crachás (VIP, SILVER e ESPECIAL)
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl flex items-center space-x-3">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-500">Check-ins</div>
            <div className="text-lg font-black text-emerald-700">
              {presentCount} <span className="text-xs text-slate-400 font-normal">/ {attendees.length}</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search Bar & Filter Buttons */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Digite o nome do participante para fazer check-in..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition shadow-sm"
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
            {(['ALL', 'ABSENT', 'PRESENT'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-md font-medium transition ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'ALL' ? 'Todos' : st === 'ABSENT' ? 'Pendentes' : 'Confirmados'}
              </button>
            ))}
          </div>

          <span className="text-slate-500 text-xs">
            Exibindo <strong className="text-slate-900">{filteredAttendees.length}</strong>
          </span>
        </div>
      </div>

      {/* Reception List Cards */}
      <div className="space-y-3">
        {filteredAttendees.map(item => (
          <div
            key={item.id}
            className={`clean-card p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              item.isPresent ? 'border-emerald-200 bg-emerald-50/20' : ''
            }`}
          >
            {/* Left Info */}
            <div className="flex items-center space-x-3.5">
              <img
                src={item.photoUrl}
                alt={item.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
              />
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">{item.name}</h2>
                  <BadgePill level={item.level} size="sm" />
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span
                    className={`font-bold text-[10px] px-2 py-0.5 rounded border uppercase ${
                      item.level === 'VIP'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : item.level === 'ESPECIAL'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    Crachá: {item.level}
                  </span>

                  {item.isPresent && (
                    <span className="text-emerald-700 font-medium text-[11px]">
                      • Presença às {item.checkInTime || 'Agora'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Check-in Toggle Button */}
            <button
              onClick={() => handleCheckInToggle(item.id, item.isPresent)}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg font-bold text-xs flex items-center justify-center space-x-2 transition shadow-sm ${
                item.isPresent
                  ? 'bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-emerald-700 border border-slate-200'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {item.isPresent ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Presença Confirmada</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Confirmar Presença</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
