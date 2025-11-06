import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskForm } from '@/domain/task/components/TaskForm';
import { QuickTaskForm } from '@/domain/task/components/QuickTaskForm';
import { TemplateSelector } from '@/domain/task/components/TemplateSelector';
import { useTaskCreate } from '@/domain/task/hooks/useTaskCreate';
import { useQuickTaskCreate } from '@/domain/task/hooks/useQuickTaskCreate';
import { useTaskFromTemplate } from '@/domain/task/hooks/useTaskFromTemplate';
import { useTemplates } from '@/domain/task/hooks/useTemplates';
import type { CreateTaskDto, Template } from '@/domain/task/types';

type ViewMode = 'full' | 'quick' | 'template' | 'form-from-template';

/**
 * @page TaskCreatePage
 * @summary Page for creating tasks with multiple creation modes
 * @domain task
 * @type form-page
 * @category task-management
 */
export const TaskCreatePage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('full');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const { createTask, isCreating: isCreatingFull } = useTaskCreate({
    onSuccess: () => {
      alert('Tarefa criada com sucesso!');
      navigate('/');
    },
    onError: (error: Error) => {
      alert(`Erro ao criar tarefa: ${error.message}`);
    },
  });

  const { createQuickTask, isCreating: isCreatingQuick } = useQuickTaskCreate({
    onSuccess: () => {
      alert('Tarefa criada com sucesso!');
      navigate('/');
    },
    onError: (error: Error) => {
      alert(`Erro ao criar tarefa: ${error.message}`);
    },
  });

  const { createFromTemplate, isCreating: isCreatingFromTemplate } = useTaskFromTemplate({
    onSuccess: () => {
      alert('Tarefa criada a partir do template com sucesso!');
      navigate('/');
    },
    onError: (error: Error) => {
      alert(`Erro ao criar tarefa: ${error.message}`);
    },
  });

  const { templates, isLoading: isLoadingTemplates } = useTemplates();

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setViewMode('form-from-template');
  };

  const handleFormSubmit = (data: CreateTaskDto) => {
    if (viewMode === 'form-from-template' && selectedTemplate) {
      createFromTemplate({
        templateId: selectedTemplate.id,
        overrides: data,
      });
    } else {
      createTask(data);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const getInitialDataFromTemplate = (): Partial<CreateTaskDto> | undefined => {
    if (!selectedTemplate) return undefined;

    return {
      title: selectedTemplate.predefinedFields.title,
      description: selectedTemplate.predefinedFields.description,
      priority: selectedTemplate.predefinedFields.priority || 'média',
      tags: selectedTemplate.predefinedFields.tags,
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Criar Nova Tarefa</h1>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setViewMode('full')}
              className={`px-4 py-2 rounded-md ${
                viewMode === 'full' || viewMode === 'form-from-template'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              Formulário Completo
            </button>
            <button
              onClick={() => setViewMode('quick')}
              className={`px-4 py-2 rounded-md ${
                viewMode === 'quick' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
              }`}
            >
              Criação Rápida
            </button>
            <button
              onClick={() => setViewMode('template')}
              className={`px-4 py-2 rounded-md ${
                viewMode === 'template' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
              }`}
            >
              Usar Template
            </button>
          </div>
        </div>

        {viewMode === 'full' && (
          <TaskForm
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            isSubmitting={isCreatingFull}
          />
        )}

        {viewMode === 'quick' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Criação Rápida</h2>
            <QuickTaskForm
              onSubmit={createQuickTask}
              onCancel={handleCancel}
              isSubmitting={isCreatingQuick}
            />
          </div>
        )}

        {viewMode === 'template' && (
          <TemplateSelector
            templates={templates}
            onSelect={handleTemplateSelect}
            onCancel={handleCancel}
            isLoading={isLoadingTemplates}
          />
        )}

        {viewMode === 'form-from-template' && selectedTemplate && (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-900">
                Criando tarefa a partir do template: <strong>{selectedTemplate.name}</strong>
              </p>
              <button
                onClick={() => {
                  setSelectedTemplate(null);
                  setViewMode('template');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 mt-2"
              >
                ← Voltar para seleção de templates
              </button>
            </div>
            <TaskForm
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
              isSubmitting={isCreatingFromTemplate}
              initialData={getInitialDataFromTemplate()}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCreatePage;
