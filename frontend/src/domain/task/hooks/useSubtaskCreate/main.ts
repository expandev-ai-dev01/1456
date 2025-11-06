import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../../services/taskService';
import type { UseSubtaskCreateOptions, UseSubtaskCreateReturn } from './types';

/**
 * @hook useSubtaskCreate
 * @summary Hook for creating subtasks
 * @domain task
 * @type domain-hook
 * @category data
 */
export const useSubtaskCreate = (options: UseSubtaskCreateOptions = {}): UseSubtaskCreateReturn => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: taskService.createSubtask,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['subtasks', data.parentTaskId] });
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    createSubtask: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
