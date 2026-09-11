/**
 * checkInTime é armazenado como ISO 8601 completo (data + hora) para permitir
 * ordenação/auditoria confiável. Esta função extrai só "HH:MM" pra exibição.
 * Mantém fallback pro formato antigo ("HH:MM" puro) para dados já salvos antes da migração.
 */
export function formatCheckInTime(checkInTime: string | null | undefined): string {
  if (!checkInTime) return '';

  const parsed = new Date(checkInTime);
  if (Number.isNaN(parsed.getTime())) {
    return checkInTime;
  }

  return parsed.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
