import { useNavigate } from 'react-router-dom';

/**
 * @page HomePage
 * @summary Home page - welcome screen for TODO list application
 * @domain core
 * @type landing-page
 * @category public
 */
export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">TODO List</h1>
        <p className="text-xl text-gray-600 mb-8">Sistema de Gerenciamento de Tarefas</p>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bem-vindo!</h2>
          <p className="text-gray-600 mb-4">
            Organize suas tarefas de forma eficiente com nosso sistema completo de gerenciamento.
          </p>

          <button
            onClick={() => navigate('/tasks/new')}
            className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
          >
            Criar Nova Tarefa
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="p-4 bg-blue-50 rounded-md">
              <h3 className="font-semibold text-blue-900 mb-2">Criação de Tarefas</h3>
              <p className="text-sm text-blue-700">
                Crie tarefas com título, descrição e prioridade
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-md">
              <h3 className="font-semibold text-green-900 mb-2">Categorização</h3>
              <p className="text-sm text-green-700">Organize em categorias personalizadas</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-md">
              <h3 className="font-semibold text-purple-900 mb-2">Prioridades</h3>
              <p className="text-sm text-purple-700">Defina níveis de importância</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-md">
              <h3 className="font-semibold text-orange-900 mb-2">Prazos</h3>
              <p className="text-sm text-orange-700">Estabeleça datas limite</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
