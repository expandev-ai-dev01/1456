import type { Template } from '../../types';

export interface TemplateSelectorProps {
  templates: Template[];
  onSelect: (template: Template) => void;
  onCancel: () => void;
  isLoading?: boolean;
}
