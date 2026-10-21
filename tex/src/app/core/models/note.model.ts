export type NoteColor = 'amber' | 'blue' | 'green' | 'purple' | 'rose';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  color: NoteColor;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoteDraft {
  title: string;
  content: string;
  tags: string[];
  color: NoteColor;
  pinned: boolean;
}

export const NOTE_COLORS: NoteColor[] = ['amber', 'blue', 'green', 'purple', 'rose'];