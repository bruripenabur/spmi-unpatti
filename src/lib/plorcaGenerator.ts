/**
 * PLOR+CA Compiler & Narrative Formatter
 * Model Audit Mutu Internal (AMI) LPMPP Universitas Pattimura
 * Konseptor: Dr. Bruri Melky Laimeheriwa
 */

export interface PlorCaData {
  problem?: string;
  location?: string;
  objective_evidence?: string;
  reference?: string;
  correction?: string;
  action?: string;
  judul?: string;
}

export function generatePlorCaNarrative(data: PlorCaData): string {
  const parts: string[] = [];

  const title = data.judul?.trim() || 'TEMUAN AUDIT MUTU INTERNAL';
  parts.push(`[${title} — LPMPP UNIVERSITAS PATTIMURA]`);

  if (data.location?.trim()) {
    parts.push(`• Lokasi/Unit: ${data.location.trim()}`);
  }

  if (data.reference?.trim()) {
    parts.push(`• Rujukan/Standar: ${data.reference.trim()}`);
  }

  if (data.problem?.trim()) {
    parts.push(`• Problem (Masalah): ${data.problem.trim()}`);
  }

  if (data.objective_evidence?.trim()) {
    parts.push(`• Objective Evidence (Bukti Objektif): ${data.objective_evidence.trim()}`);
  }

  if (data.correction?.trim()) {
    parts.push(`• Correction (Tindakan Koreksi Cepat): ${data.correction.trim()}`);
  }

  if (data.action?.trim()) {
    parts.push(`• Corrective Action (Tindakan Korektif/Akar Masalah): ${data.action.trim()}`);
  }

  return parts.join('\n');
}

export function generateCompactSummary(data: PlorCaData): string {
  const problem = data.problem?.trim() || '-';
  const loc = data.location?.trim() ? ` pada ${data.location.trim()}` : '';
  const ref = data.reference?.trim() ? ` terhadap rujukan ${data.reference.trim()}` : '';
  const proof = data.objective_evidence?.trim() ? ` dibuktikan dengan ${data.objective_evidence.trim()}` : '';
  const corr = data.correction?.trim() ? ` Tindakan koreksi: ${data.correction.trim()}.` : '';
  const act = data.action?.trim() ? ` Tindakan pencegahan sistemik: ${data.action.trim()}.` : '';

  return `Ditemukan ketidaksesuaian: ${problem}${loc}${ref}${proof}.${corr}${act}`;
}
