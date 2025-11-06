export interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: 'alta' | 'média' | 'baixa';
  tags: string[];
  assignedUsers: string[];
  status: 'pendente' | 'em_andamento' | 'concluída';
  createdAt: string;
}

export interface Subtask {
  id: string;
  parentTaskId: string;
  title: string;
  description: string | null;
  status: 'pendente' | 'concluída';
  dueDate: string | null;
  createdAt: string;
}

export interface Template {
  id: string;
  name: string;
  description: string | null;
  type: 'padrão' | 'personalizado';
  predefinedFields: {
    title?: string;
    description?: string;
    priority?: 'alta' | 'média' | 'baixa';
    tags?: string[];
  };
  predefinedSubtasks: Array<{
    title: string;
    description?: string;
  }>;
}

export interface CreateTaskDto {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority: 'alta' | 'média' | 'baixa';
  tags?: string[];
  assignedUsers?: string[];
}

export interface CreateQuickTaskDto {
  title: string;
}

export interface CreateSubtaskDto {
  parentTaskId: string;
  title: string;
  description?: string | null;
}

export interface CreateTaskFromTemplateDto {
  templateId: string;
  overrides?: Partial<CreateTaskDto>;
}
