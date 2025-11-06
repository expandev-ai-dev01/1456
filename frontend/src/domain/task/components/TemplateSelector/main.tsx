import type { TemplateSelectorProps } from './types';
import { getTemplateSelectorClassName, getTemplateCardClassName } from './variants';

/**
 * @component TemplateSelector
 * @summary Component for selecting task templates
 * @domain task
 * @type domain-component
 * @category display
 */
export const TemplateSelector = ({
  templates,
  onSelect,
  onCancel,
  isLoading,
}: TemplateSelectorProps) => {
  if (isLoading) {
    return (
      <div className={getTemplateSelectorClassName()}>
        <p className="text-center text-gray-600">Carregando templates...</p>
      </div>
    );
  }

  return (
    <div className={getTemplateSelectorClassName()}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Selecione um Template</h2>
        <button
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-900"
          aria-label="Fechar"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className={getTemplateCardClassName()}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                {template.description && (
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                )}
                <span
                  className={`inline-block px-2 py-1 text-xs rounded ${
                    template.type === 'padrão'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {template.type === 'padrão' ? 'Sistema' : 'Personalizado'}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};
