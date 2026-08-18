import React from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BadgePill } from '../components/BadgePill';
import { Award, CheckCircle2, QrCode } from 'lucide-react';

export const PublicBadgePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { attendees } = useApp();

  const attendee = attendees.find(a => a.id === id);

  if (!attendee) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center font-sans">
        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 mb-4 shadow-sm">
          <QrCode className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-1">Crachá não encontrado</h1>
        <p className="text-sm text-slate-500 max-w-sm">
          Este QR Code não consta na lista oficial de participantes da Imersão Rise.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      {/* Main Digital Badge Card */}
      <div className="w-full max-w-sm">
        <div className="clean-card rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-md text-center space-y-6 relative">
          {/* Top Hole Visual */}
          <div className="w-12 h-2.5 bg-slate-200 rounded-full mx-auto mb-2 border border-slate-300" />

          {/* Header */}
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between text-left">
            <div>
              <span className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase block">
                Credencial Oficial
              </span>
              <span className="text-sm font-bold text-slate-900">IMERSÃO RISE</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Barueri • SP</span>
              <span className="text-[10px] font-semibold text-slate-600">Teacher Ana de Araújo</span>
            </div>
          </div>

          {/* Avatar Photo */}
          <div className="relative inline-block mx-auto">
            <img
              src={attendee.photoUrl}
              alt={attendee.name}
              className="w-32 h-32 object-cover rounded-2xl border-2 border-slate-200 shadow-sm"
            />
            {attendee.isPresent && (
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-md border-2 border-white">
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              </div>
            )}
          </div>

          {/* Attendee Name & Badge Tier */}
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {attendee.name}
            </h1>
            <div className="flex justify-center pt-1">
              <BadgePill level={attendee.level} size="lg" />
            </div>
          </div>

          {/* Footer Seal */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-center space-x-1.5 text-xs text-slate-500">
            <Award className="w-4 h-4 text-slate-400" />
            <span>Participante Verificado de 2026</span>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
            Imersão Rise • O Maior Evento para Professores de Idiomas
          </p>
        </div>
      </div>
    </div>
  );
};
