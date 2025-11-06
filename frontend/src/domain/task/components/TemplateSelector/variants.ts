import { clsx } from 'clsx';

export function getTemplateSelectorClassName(): string {
  return clsx('bg-white rounded-lg shadow-lg p-6', 'max-w-4xl mx-auto');
}

export function getTemplateCardClassName(): string {
  return clsx(
    'p-4 border-2 border-gray-200 rounded-lg',
    'hover:border-blue-500 hover:bg-blue-50',
    'transition-colors duration-200',
    'text-left w-full'
  );
}
