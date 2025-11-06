import type { CreateQuickTaskDto } from '../../types';

export interface QuickTaskFormProps {
  onSubmit: (data: CreateQuickTaskDto) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}
