import { clsx } from 'clsx';

export function getErrorMessageClassName(): string {
  return clsx('flex items-center justify-center min-h-screen p-4', 'bg-gray-50');
}
