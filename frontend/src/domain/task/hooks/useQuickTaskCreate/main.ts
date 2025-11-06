import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../../services/taskService';
import type { UseQuickTaskCreateOptions, UseQuickTaskCreateReturn } from './types';

/**
 * @hook useQuickTaskCreate
 * @summary Hook for creating quick tasks with only title
 * @domain task
 * @type domain-hook
 * @category data
 */
export const useQuickTaskCreate = (
  options: UseQuickTaskCreateOptions = {}
): UseQuickTaskCreateReturn => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: taskService.createQuick,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    createQuickTask: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
