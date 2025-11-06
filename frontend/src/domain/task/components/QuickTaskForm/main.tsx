import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { QuickTaskFormProps } from './types';
import type { CreateQuickTaskDto } from '../../types';
import { getQuickTaskFormClassName } from './variants';

const quickTaskSchema = z.object({
  title: z
    .string()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(100, 'O título deve ter no máximo 100 caracteres'),
});

/**
 * @component QuickTaskForm
 * @summary Form for quick task creation with only title
 * @domain task
 * @type domain-component
 * @category form
 */
export const QuickTaskForm = ({ onSubmit, onCancel, isSubmitting }: QuickTaskFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateQuickTaskDto>({
    resolver: zodResolver(quickTaskSchema),
    defaultValues: {
      title: '',
    },
  });

  const handleFormSubmit = (data: CreateQuickTaskDto) => {
    onSubmit(data);
    reset();
  };

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={getQuickTaskFormClassName()}>
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            {...register('title')}
            placeholder="Digite o título da tarefa"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Criando...' : 'Adicionar'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};
