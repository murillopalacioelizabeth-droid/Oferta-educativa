export type ProgramLevel = 'Operario' | 'Técnico' | 'Tecnólogo';

export interface TrainingProgram {
  id: string;
  name: string;
  level: ProgramLevel;
  duration: string; // e.g. "6 meses (880 horas)"
  stageLectiva: string; // e.g. "3 meses"
  stageProductiva: string; // e.g. "3 meses"
  schedule: string; // e.g. "Diurna, Nocturna, Mixta"
  requirements: string[];
  description: string;
  profile: string; // Perfil del egresado
  competencies: string[]; // Competencias clave
  machinesUsed: string[]; // Maquinaria con la que aprenderá
  fieldsOfAction: string[]; // Salida laboral / Dónde trabajará
  genderPopularity?: string; // e.g. "Altamente requerido por marcas de activewear"
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface PqrsDraft {
  id: string;
  fullName: string;
  email: string;
  documentId: string;
  role: 'aspirante' | 'aprendiz' | 'egresado';
  programName?: string;
  requestType: 'peticion' | 'queja' | 'reclamo' | 'sugerencia' | 'apoyo_socioeconomico' | 'novedad_tramite';
  details: string;
  formattedText?: string;
  createdAt: string;
  status: 'borrador' | 'generado' | 'enviado';
}

export interface EnrollmentTimelineStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  dateEst: string; // Estimated period
  status: 'completado' | 'en_curso' | 'proximo';
}
