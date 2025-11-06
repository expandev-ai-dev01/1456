import type { CreateQuickTaskDto, Task } from '../../types';

export interface UseQuickTaskCreateOptions {
  onSuccess?: (task: Task) => void;
  onError?: (error: Error) => void;
}

export interface UseQuickTaskCreateReturn {
  createQuickTask: (data: CreateQuickTaskDto) => Promise<Task>;
  isCreating: boolean;
  error: Error | null;
}
