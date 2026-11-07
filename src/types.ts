export type ScienceSubject = '물리' | '화학' | '생명과학' | '지구과학';
export type GradeLevel = '중1' | '중2' | '중3';

export interface ConceptCard {
  title: string;
  summary: string;
  formula?: string;
  keyPoints?: string[];
}

export interface Question {
  id: number;
  subject: ScienceSubject;
  grade: GradeLevel;
  title: string;
  prompt: string;
  diagramType?: 'mirror_lens' | 'density_float' | 'photosynthesis' | 'moon_phases' | 'gravity_vacuum' | 'endothermic' | 'digestion_enzymes' | 'greenhouse' | 'ohms_law' | 'precipitation';
  choices: [string, string, string, string];
  answer: 1 | 2 | 3 | 4;
  explanation: string;
  conceptCard: ConceptCard;
}

export interface ExtendedFingers {
  thumb: boolean;
  index: boolean;
  middle: boolean;
  ring: boolean;
  pinky: boolean;
}

export type InputMode = 'gesture' | 'mouse';

export type CameraStatus = 
  | 'idle'
  | 'loading_engine'
  | 'requesting_camera'
  | 'ready'
  | 'permission_denied'
  | 'no_camera_found'
  | 'engine_error';

export interface GestureDetectionState {
  isHandPresent: boolean;
  fingerCount: number;
  extendedFingers: ExtendedFingers;
  candidateChoice: 1 | 2 | 3 | 4 | 5 | null;
  actionType: 'select_choice' | 'next_question' | null;
  holdProgress: number; // 0 to 1
  holdRemainingSeconds: number; // 1.5 to 0
  isHoldCompleted: boolean;
}
