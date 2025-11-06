# TODO List - Sistema de Gerenciamento de Tarefas

## Descrição

Sistema completo de gerenciamento de tarefas com funcionalidades avançadas de organização, priorização e colaboração.

## Tecnologias

- **React 18.3.1** - Framework frontend
- **TypeScript 5.6.3** - Tipagem estática
- **Vite 5.4.11** - Build tool e dev server
- **React Router DOM 6.26.2** - Roteamento
- **TanStack Query 5.59.20** - Gerenciamento de estado servidor
- **Axios 1.7.7** - Cliente HTTP
- **React Hook Form 7.53.1** - Gerenciamento de formulários
- **Zod 3.23.8** - Validação de schemas
- **Tailwind CSS 3.4.14** - Framework CSS
- **date-fns 4.1.0** - Manipulação de datas

## Estrutura do Projeto

```
src/
├── app/                    # Configuração da aplicação
│   ├── App.tsx            # Componente raiz
│   └── router.tsx         # Configuração de rotas
├── assets/                # Recursos estáticos
│   └── styles/           # Estilos globais
├── core/                  # Componentes e utilitários compartilhados
│   ├── components/       # Componentes UI genéricos
│   ├── lib/              # Configurações de bibliotecas
│   ├── types/            # Tipos TypeScript globais
│   └── utils/            # Funções utilitárias
├── domain/               # Domínios de negócio (features)
├── pages/                # Páginas da aplicação
│   └── layouts/          # Layouts compartilhados
└── main.tsx              # Entry point
```

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Lint
npm run lint
```

## Configuração

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Copie `.env.example` para `.env` e configure as variáveis
4. Execute `npm run dev`

## Variáveis de Ambiente

```env
VITE_API_URL=http://localhost:3000
VITE_API_VERSION=v1
VITE_API_TIMEOUT=30000
```

## Funcionalidades Principais

- ✅ Criação de tarefas com título, descrição e prioridade
- ✅ Categorização em listas personalizadas
- ✅ Definição de prioridades (alta, média, baixa)
- ✅ Estabelecimento de prazos
- ✅ Marcação de conclusão
- ✅ Busca de tarefas
- ✅ Notificações e lembretes
- ✅ Compartilhamento de tarefas
- ✅ Visualização em calendário
- ✅ Sincronização multiplataforma

## Padrões de Código

- Componentes em PascalCase
- Hooks com prefixo `use`
- Tipos e interfaces em PascalCase
- Arquivos de implementação: `main.tsx` ou `main.ts`
- Arquivos de tipos: `types.ts`
- Arquivos de variantes: `variants.ts`
- Exports centralizados em `index.ts`

## Arquitetura

- **Domain-Driven Design**: Organização por domínios de negócio
- **Component-Driven**: Componentes reutilizáveis e isolados
- **Type-Safe**: TypeScript em modo strict
- **API Integration**: Separação entre endpoints públicos e autenticados
- **State Management**: TanStack Query para estado servidor, Zustand para estado cliente

## Contribuindo

1. Crie uma branch para sua feature
2. Faça commit das mudanças
3. Abra um Pull Request

## Licença

MIT