import { useQuery } from '@tanstack/react-query';
import { taskService } from '../../services/taskService';
import type { UseTemplatesReturn } from './types';

/**
 * @hook useTemplates
 * @summary Hook for fetching available task templates
 * @domain task
 * @type domain-hook
 * @category data
 */
export const useTemplates = (): UseTemplatesReturn => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['templates'],
    queryFn: taskService.listTemplates,
    staleTime: 10 * 60 * 1000,
  });

  return {
    templates: data || [],
    isLoading,
    error: error as Error | null,
  };
};
