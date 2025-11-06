import type { CreateTaskFromTemplateDto, Task, Subtask } from '../../types';

export interface UseTaskFromTemplateOptions {
  onSuccess?: (result: { task: Task; subtasks: Subtask[] }) => void;
  onError?: (error: Error) => void;
}

export interface UseTaskFromTemplateReturn {
  createFromTemplate: (data: CreateTaskFromTemplateDto) => Promise<{
    task: Task;
    subtasks: Subtask[];
  }>;
  isCreating: boolean;
  error: Error | null;
}
