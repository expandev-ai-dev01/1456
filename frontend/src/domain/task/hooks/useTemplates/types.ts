import type { Template } from '../../types';

export interface UseTemplatesReturn {
  templates: Template[];
  isLoading: boolean;
  error: Error | null;
}
