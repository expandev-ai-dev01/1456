import type { CreateSubtaskDto, Subtask } from '../../types';

export interface UseSubtaskCreateOptions {
  onSuccess?: (subtask: Subtask) => void;
  onError?: (error: Error) => void;
}

export interface UseSubtaskCreateReturn {
  createSubtask: (data: CreateSubtaskDto) => Promise<Subtask>;
  isCreating: boolean;
  error: Error | null;
}
