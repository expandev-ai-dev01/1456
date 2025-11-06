import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../../services/taskService';
import type { UseTaskFromTemplateOptions, UseTaskFromTemplateReturn } from './types';

/**
 * @hook useTaskFromTemplate
 * @summary Hook for creating tasks from templates
 * @domain task
 * @type domain-hook
 * @category data
 */
export const useTaskFromTemplate = (
  options: UseTaskFromTemplateOptions = {}
): UseTaskFromTemplateReturn => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: taskService.createFromTemplate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    createFromTemplate: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};
