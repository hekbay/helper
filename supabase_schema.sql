-- ========================================================
-- HELPER (Imersão Rise) • Supabase Database Schema
-- Execute este script INTEIRO no SQL Editor do seu projeto Supabase.
-- É seguro rodar mais de uma vez (idempotente) e funciona tanto em um
-- banco novo quanto em um banco que já tenha rodado versões anteriores
-- deste script.
-- ========================================================

-- 0. Migração (ajusta uma tabela attendees já existente para o formato atual,
--    não importa de qual versão antiga ela esteja — cada coluna é adicionada
--    só se ainda não existir)
ALTER TABLE IF EXISTS public.attendees DROP COLUMN IF EXISTS is_special;
ALTER TABLE IF EXISTS public.attendees DROP COLUMN IF EXISTS is_flexge;
ALTER TABLE IF EXISTS public.attendees DROP COLUMN IF EXISTS is_meteoric;

ALTER TABLE IF EXISTS public.attendees ADD COLUMN IF NOT EXISTS is_sponsor BOOLEAN DEFAULT FALSE;
ALTER TABLE IF EXISTS public.attendees ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'CONFIRMED';
ALTER TABLE IF EXISTS public.attendees ADD COLUMN IF NOT EXISTS is_present BOOLEAN DEFAULT FALSE;
ALTER TABLE IF EXISTS public.attendees ADD COLUMN IF NOT EXISTS check_in_time TEXT;
ALTER TABLE IF EXISTS public.attendees ADD COLUMN IF NOT EXISTS is_mentee BOOLEAN DEFAULT FALSE;
ALTER TABLE IF EXISTS public.attendees ADD COLUMN IF NOT EXISTS near_renewal BOOLEAN DEFAULT FALSE;
ALTER TABLE IF EXISTS public.attendees ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE IF EXISTS public.attendees ADD COLUMN IF NOT EXISTS is_accompanied BOOLEAN DEFAULT FALSE;
ALTER TABLE IF EXISTS public.attendees ADD COLUMN IF NOT EXISTS accompanied_by TEXT;
ALTER TABLE IF EXISTS public.attendees ADD COLUMN IF NOT EXISTS companion_name TEXT;
ALTER TABLE IF EXISTS public.attendees ADD COLUMN IF NOT EXISTS current_mentorship TEXT;
ALTER TABLE IF EXISTS public.attendees ADD COLUMN IF NOT EXISTS cycle TEXT;
ALTER TABLE IF EXISTS public.attendees ADD COLUMN IF NOT EXISTS cycle_end_date TEXT;
ALTER TABLE IF EXISTS public.attendees ADD COLUMN IF NOT EXISTS mentorship_remaining TEXT;
ALTER TABLE IF EXISTS public.attendees ADD COLUMN IF NOT EXISTS is_paying BOOLEAN DEFAULT FALSE;
ALTER TABLE IF EXISTS public.attendees ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE IF EXISTS public.attendees ADD COLUMN IF NOT EXISTS installment_value TEXT;
ALTER TABLE IF EXISTS public.attendees ADD COLUMN IF NOT EXISTS remaining_installments INTEGER;
ALTER TABLE IF EXISTS public.attendees ADD COLUMN IF NOT EXISTS mentorship_value TEXT;
ALTER TABLE IF EXISTS public.attendees ADD COLUMN IF NOT EXISTS amount_paid TEXT;
ALTER TABLE IF EXISTS public.attendees ADD COLUMN IF NOT EXISTS credit_balance TEXT;
ALTER TABLE IF EXISTS public.attendees ADD COLUMN IF NOT EXISTS offer_to_make TEXT;
ALTER TABLE IF EXISTS public.attendees ADD COLUMN IF NOT EXISTS special_condition TEXT;

-- Normaliza cycle_end_date de "DD/MM/AAAA" (formato antigo) para "AAAA-MM-DD" (ISO, usado pelo seletor de data)
UPDATE public.attendees
SET cycle_end_date = substring(cycle_end_date from 7 for 4) || '-' || substring(cycle_end_date from 4 for 2) || '-' || substring(cycle_end_date from 1 for 2)
WHERE cycle_end_date ~ '^\d{2}/\d{2}/\d{4}$';

-- 1. Tabela de Participantes (Attendees)
CREATE TABLE IF NOT EXISTS public.attendees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  instagram TEXT,
  level TEXT NOT NULL CHECK (level IN ('VIP', 'SILVER')),
  is_sponsor BOOLEAN DEFAULT FALSE, -- Flag "Patrocinador?"
  status TEXT DEFAULT 'CONFIRMED',
  is_present BOOLEAN DEFAULT FALSE,
  check_in_time TEXT,
  is_mentee BOOLEAN DEFAULT FALSE,
  near_renewal BOOLEAN DEFAULT FALSE,
  photo_url TEXT,

  -- Acompanhante
  is_accompanied BOOLEAN DEFAULT FALSE,
  accompanied_by TEXT CHECK (accompanied_by IN ('Esposo(a)', 'Professor parceiro', 'Colaborador', 'Amigo')),
  companion_name TEXT,

  -- Situação de mentoria
  current_mentorship TEXT,
  cycle TEXT,
  cycle_end_date TEXT, -- formato ISO "AAAA-MM-DD"
  mentorship_remaining TEXT,
  is_paying BOOLEAN DEFAULT FALSE,
  payment_method TEXT CHECK (payment_method IN ('Boleto', 'Cartão de Crédito')),
  installment_value TEXT,
  remaining_installments INTEGER,
  mentorship_value TEXT,   -- Valor total da mentoria
  amount_paid TEXT,        -- Valor já pago
  credit_balance TEXT,     -- Valor em haver (tempo restante convertido em dinheiro)

  -- Oferta
  offer_to_make TEXT,
  special_condition TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de Anotações dos Closers (Closer Notes)
CREATE TABLE IF NOT EXISTS public.closer_notes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  attendee_id TEXT NOT NULL REFERENCES public.attendees(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  closer_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2b. Tabela da Equipe de Closers (nomes selecionáveis no login)
CREATE TABLE IF NOT EXISTS public.closers (
  name TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.closers (name) VALUES
  ('Carla'), ('Davi'), ('Emmy'), ('Ricardo'), ('Everton')
ON CONFLICT (name) DO NOTHING;

-- 3. Habilitar RLS e Permissões Públicas
ALTER TABLE public.attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.closer_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.closers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acesso Leitura e Escrita Attendees" ON public.attendees;
CREATE POLICY "Acesso Leitura e Escrita Attendees" ON public.attendees FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acesso Leitura e Escrita Closer Notes" ON public.closer_notes;
CREATE POLICY "Acesso Leitura e Escrita Closer Notes" ON public.closer_notes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acesso Leitura e Escrita Closers" ON public.closers;
CREATE POLICY "Acesso Leitura e Escrita Closers" ON public.closers FOR ALL USING (true) WITH CHECK (true);

-- 4. Inserção dos Dados Iniciais (Seed Data com a Lógica do Fluxograma)
-- Só insere se os IDs ainda não existirem (ON CONFLICT DO NOTHING) — não sobrescreve dados reais já cadastrados.
INSERT INTO public.attendees (
  id, name, phone, instagram, level, is_sponsor, status, is_present, check_in_time,
  is_mentee, near_renewal, photo_url, is_accompanied, accompanied_by, companion_name,
  current_mentorship, cycle, cycle_end_date, mentorship_remaining, is_paying, payment_method, installment_value, remaining_installments,
  offer_to_make, special_condition
) VALUES
('rise-vip-001', 'Carolina Santos Mendes', '(11) 98765-4321', '@carol.englishtips', 'VIP', false, 'CONFIRMED', true, '2026-09-12T08:45:00-03:00',
  true, true, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', true, 'Esposo(a)', 'Marcos Mendes',
  'Professores de Elite', '3º ciclo', '2026-12-15', '2 meses', true, 'Cartão de Crédito', 'R$ 897,00', 4,
  'Mastermind', 'Upgrade com desconto de fidelidade (3+ ciclos)'),
('rise-vip-002', 'Dr. Roberto Magalhães', '(21) 99887-1122', '@prof.robertomagalhaes', 'VIP', false, 'CONFIRMED', true, '2026-09-12T08:30:00-03:00',
  true, false, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80', false, NULL, NULL,
  'Professores de Elite', '1º ciclo', '2027-03-20', NULL, true, 'Boleto', 'R$ 897,00', 10,
  'Mastermind', NULL),
('rise-vip-003', 'Fernanda Lima Alencar', '(19) 97112-3344', '@fer.englishcoach', 'VIP', false, 'CONFIRMED', true, '2026-09-12T08:50:00-03:00',
  false, false, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80', false, NULL, NULL,
  NULL, NULL, NULL, NULL, false, NULL, NULL, NULL,
  'Mentoria Rise de Entrada', 'Condição especial de lançamento (veio do Silver)'),
('rise-patro-001', 'Henrique Flexge (Patrocinador)', '(11) 97777-8888', '@flexge.oficial', 'VIP', true, 'CONFIRMED', true, '2026-09-12T08:15:00-03:00',
  false, false, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', true, 'Colaborador', 'Time Flexge',
  NULL, NULL, NULL, NULL, false, NULL, NULL, NULL,
  NULL, 'Patrocinador Oficial do Evento (Flexge Platform)'),
('rise-slv-001', 'Marcelo Augusto Prado', '(41) 98844-5566', '@marceloprado.esl', 'SILVER', false, 'CONFIRMED', true, '2026-09-12T09:10:00-03:00',
  false, false, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', false, NULL, NULL,
  NULL, NULL, NULL, NULL, false, NULL, NULL, NULL,
  'Mentoria Rise de Entrada', NULL)
ON CONFLICT (id) DO NOTHING;
