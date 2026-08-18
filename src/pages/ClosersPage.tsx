import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import type { Attendee, BadgeLevel } from '../types/index';
import { BadgePill } from '../components/BadgePill';
import {
  Search,
  CheckCircle2,
  MessageCircle,
  UserCheck,
  RotateCw,
  ChevronDown,
  ChevronUp,
  Send,
  Sparkles,
  Phone,
  Mail,
  ExternalLink,
  Award,
  BookOpen
} from 'lucide-react';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export const ClosersPage: React.FC = () => {
  const { attendees, addCloserNote, userSession } = useApp();

  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<'ALL' | BadgeLevel>('ALL');
  const [presentOnly, setPresentOnly] = useState(false);
  const [menteeOnly, setMenteeOnly] = useState(false);
  const [renewalOnly, setRenewalOnly] = useState(false);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState<{ [key: string]: string }>({});

  const filteredAttendees = useMemo(() => {
    return attendees.filter(item => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.phone.includes(q) ||
        item.instagram.toLowerCase().includes(q) ||
        item.expertNote.toLowerCase().includes(q);

      const matchesLevel = levelFilter === 'ALL' || item.level === levelFilter;
      const matchesPresent = !presentOnly || item.isPresent;
      const matchesMentee = !menteeOnly || item.isMentee;
      const matchesRenewal = !renewalOnly || item.nearRenewal;

      return matchesSearch && matchesLevel && matchesPresent && matchesMentee && matchesRenewal;
    });
  }, [attendees, search, levelFilter, presentOnly, menteeOnly, renewalOnly]);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleAddNote = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = newNoteText[id]?.trim();
    if (!text) return;

    addCloserNote(id, text, userSession.userName || 'Closer');
    setNewNoteText(prev => ({ ...prev, [id]: '' }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Inteligência de Vendas • Closers
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Informações estratégicas escritas pela Teacher Ana de Araújo para abordagens de alta conversão
          </p>
        </div>

        <div className="text-xs text-slate-600 font-medium bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200">
          Exibindo <strong className="text-slate-900">{filteredAttendees.length}</strong> de {attendees.length} participantes
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, telefone, instagram ou palavra-chave..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center bg-white p-1 rounded-lg border border-slate-300 gap-1 overflow-x-auto shadow-sm">
            {(['ALL', 'VIP', 'SILVER', 'ESPECIAL'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition whitespace-nowrap ${
                  levelFilter === lvl
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {lvl === 'ALL' ? 'Todos Ingressos' : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setPresentOnly(!presentOnly)}
            className={`px-3 py-1.5 rounded-md border flex items-center space-x-1.5 transition ${
              presentOnly
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Presentes no Evento</span>
          </button>

          <button
            onClick={() => setMenteeOnly(!menteeOnly)}
            className={`px-3 py-1.5 rounded-md border flex items-center space-x-1.5 transition ${
              menteeOnly
                ? 'bg-indigo-50 text-indigo-800 border-indigo-300 font-semibold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Mentorados</span>
          </button>

          <button
            onClick={() => setRenewalOnly(!renewalOnly)}
            className={`px-3 py-1.5 rounded-md border flex items-center space-x-1.5 transition ${
              renewalOnly
                ? 'bg-rose-50 text-rose-800 border-rose-300 font-semibold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5 text-rose-600" />
            <span>Próximo de Renovação</span>
          </button>

          {(presentOnly || menteeOnly || renewalOnly || levelFilter !== 'ALL' || search) && (
            <button
              onClick={() => {
                setPresentOnly(false);
                setMenteeOnly(false);
                setRenewalOnly(false);
                setLevelFilter('ALL');
                setSearch('');
              }}
              className="text-xs text-rose-600 hover:underline px-2 py-1"
            >
              Resetar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Attendees List */}
      {filteredAttendees.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center space-y-2">
          <p className="text-slate-500 text-sm">Nenhum participante encontrado com os filtros selecionados.</p>
          <button
            onClick={() => {
              setSearch('');
              setLevelFilter('ALL');
              setPresentOnly(false);
              setMenteeOnly(false);
              setRenewalOnly(false);
            }}
            className="text-xs text-slate-900 font-semibold underline"
          >
            Limpar todos os filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAttendees.map(item => {
            const isExpanded = expandedId === item.id;
            const whatsappNumber = item.phone.replace(/\D/g, '');
            const whatsappUrl = `https://wa.me/55${whatsappNumber}?text=${encodeURIComponent(
              `Olá ${item.name.split(' ')[0]}! Tudo bem? Sou da equipe da Teacher Ana de Araújo na Imersão Rise...`
            )}`;

            return (
              <div
                key={item.id}
                className={`clean-card rounded-2xl transition-all overflow-hidden ${
                  isExpanded ? 'border-slate-400 shadow-md' : ''
                }`}
              >
                {/* Summary Row */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img
                        src={item.photoUrl}
                        alt={item.name}
                        className="w-13 h-13 rounded-xl object-cover border border-slate-200"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          item.isPresent ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900">{item.name}</h2>
                        <BadgePill level={item.level} size="sm" />

                        {item.isPresent ? (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Presente {item.checkInTime && `(${item.checkInTime})`}
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                            Ausente
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {item.isMentee && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center space-x-1">
                            <Award className="w-3 h-3 text-indigo-600" />
                            <span>Mentorado</span>
                          </span>
                        )}

                        {item.nearRenewal && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 flex items-center space-x-1">
                            <RotateCw className="w-3 h-3 text-rose-600" />
                            <span>Renovação Próxima</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center space-x-1.5 transition"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      onClick={() => toggleExpand(item.id)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                        isExpanded
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                      }`}
                    >
                      <span>{isExpanded ? 'Recolher' : 'Ver Intel Completa'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expert Note Teaser */}
                <div className="px-5 pb-4">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 font-bold mr-1">Intel da Ana:</strong>
                      <span>{item.expertNote}</span>
                    </div>
                  </div>
                </div>

                {/* Cascata Expanded View */}
                {isExpanded && (
                  <div className="border-t border-slate-200 bg-slate-50/50 p-5 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-white border border-slate-200">
                        <div className="text-slate-500 font-medium flex items-center space-x-1 mb-0.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>Telefone</span>
                        </div>
                        <div className="text-slate-900 font-bold">{item.phone}</div>
                      </div>

                      <div className="p-3 rounded-lg bg-white border border-slate-200">
                        <div className="text-slate-500 font-medium flex items-center space-x-1 mb-0.5">
                          <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
                          <span>Instagram</span>
                        </div>
                        <a
                          href={`https://instagram.com/${item.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 font-bold hover:underline flex items-center space-x-1"
                        >
                          <span>{item.instagram}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="p-3 rounded-lg bg-white border border-slate-200">
                        <div className="text-slate-500 font-medium flex items-center space-x-1 mb-0.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>E-mail</span>
                        </div>
                        <div className="text-slate-900 font-bold truncate">{item.email}</div>
                      </div>
                    </div>

                    {/* Closer Notes History */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                        <span>Histórico de Abordagens</span>
                      </h3>

                      <form onSubmit={e => handleAddNote(item.id, e)} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Registrar anotação de abordagem (ex: Falou com Closer Lucas, interessado no Mastermind)..."
                          value={newNoteText[item.id] || ''}
                          onChange={e => setNewNoteText({ ...newNoteText, [item.id]: e.target.value })}
                          className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                        />
                        <button
                          type="submit"
                          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center space-x-1 shadow-sm transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Salvar</span>
                        </button>
                      </form>

                      {item.closerNotes && item.closerNotes.length > 0 ? (
                        <div className="space-y-2 pt-1">
                          {item.closerNotes.map(note => (
                            <div key={note.id} className="p-3 rounded-lg bg-white border border-slate-200 text-xs flex justify-between gap-3">
                              <div>
                                <span className="font-bold text-slate-900">{note.closerName}: </span>
                                <span className="text-slate-700">{note.text}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap">{note.date}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic">Nenhuma anotação registrada pelos closers até o momento.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
