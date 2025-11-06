import {
  TaskCreateRequest,
  TaskQuickCreateRequest,
  SubtaskCreateRequest,
  TaskFromTemplateRequest,
  TaskEntity,
  SubtaskEntity,
  TemplateEntity,
} from './taskTypes';

// In-memory storage (no database as per current policy)
const tasks = new Map<string, TaskEntity>();
const subtasks = new Map<string, SubtaskEntity>();
const templates = new Map<string, TemplateEntity>();

// Initialize system templates
initializeSystemTemplates();

function initializeSystemTemplates(): void {
  const systemTemplates: TemplateEntity[] = [
    {
      id: 'template-personal',
      name: 'Tarefa Pessoal',
      description: 'Template para tarefas pessoais',
      type: 'padrão',
      predefinedFields: {
        priority: 'média',
        tags: [],
        assignedUsers: [],
      },
      predefinedSubtasks: [],
    },
    {
      id: 'template-meeting',
      name: 'Reunião',
      description: 'Template para reuniões',
      type: 'padrão',
      predefinedFields: {
        priority: 'alta',
        tags: ['reunião'],
        assignedUsers: [],
      },
      predefinedSubtasks: [],
    },
    {
      id: 'template-project',
      name: 'Projeto',
      description: 'Template para projetos',
      type: 'padrão',
      predefinedFields: {
        priority: 'alta',
        tags: ['projeto'],
        assignedUsers: [],
      },
      predefinedSubtasks: [
        { title: 'Planejar', description: null },
        { title: 'Executar', description: null },
        { title: 'Revisar', description: null },
      ],
    },
    {
      id: 'template-reminder',
      name: 'Lembrete',
      description: 'Template para lembretes',
      type: 'padrão',
      predefinedFields: {
        priority: 'baixa',
        tags: ['lembrete'],
        assignedUsers: [],
      },
      predefinedSubtasks: [],
    },
    {
      id: 'template-shopping',
      name: 'Lista de Compras',
      description: 'Template para listas de compras',
      type: 'padrão',
      predefinedFields: {
        priority: 'média',
        tags: ['compras'],
        assignedUsers: [],
      },
      predefinedSubtasks: [],
    },
  ];

  systemTemplates.forEach((template) => templates.set(template.id, template));
}

/**
 * @summary
 * Creates a new task with full details
 *
 * @function taskCreate
 * @module task
 *
 * @param {TaskCreateRequest} params - Task creation parameters
 *
 * @returns {Promise<TaskEntity>} Created task entity
 *
 * @throws {Error} When validation fails
 *
 * @example
 * const task = await taskCreate({
 *   title: 'Complete project',
 *   description: 'Finish the TODO list project',
 *   dueDate: '2024-12-31',
 *   priority: 'alta',
 *   tags: ['work', 'urgent'],
 *   assignedUsers: ['user1']
 * });
 */
export async function taskCreate(params: TaskCreateRequest): Promise<TaskEntity> {
  const id = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const task: TaskEntity = {
    id,
    title: params.title,
    description: params.description,
    dueDate: params.dueDate,
    priority: params.priority,
    tags: params.tags,
    assignedUsers: params.assignedUsers,
    status: 'pendente',
    createdAt: new Date(),
  };

  tasks.set(id, task);
  return task;
}

/**
 * @summary
 * Creates a new task quickly with only title (default values for other fields)
 *
 * @function taskQuickCreate
 * @module task
 *
 * @param {TaskQuickCreateRequest} params - Quick task creation parameters
 *
 * @returns {Promise<TaskEntity>} Created task entity with default values
 *
 * @example
 * const task = await taskQuickCreate({ title: 'Buy groceries' });
 */
export async function taskQuickCreate(params: TaskQuickCreateRequest): Promise<TaskEntity> {
  return taskCreate({
    title: params.title,
    description: null,
    dueDate: null,
    priority: 'média',
    tags: [],
    assignedUsers: [],
  });
}

/**
 * @summary
 * Creates a new subtask associated with a parent task
 *
 * @function subtaskCreate
 * @module task
 *
 * @param {SubtaskCreateRequest} params - Subtask creation parameters
 *
 * @returns {Promise<SubtaskEntity>} Created subtask entity
 *
 * @throws {Error} When parent task not found, completed, or subtask limit reached
 *
 * @example
 * const subtask = await subtaskCreate({
 *   parentTaskId: 'task-123',
 *   title: 'Research options',
 *   description: 'Look into available solutions'
 * });
 */
export async function subtaskCreate(params: SubtaskCreateRequest): Promise<SubtaskEntity> {
  /**
   * @validation Verify parent task exists
   * @throw {Error} parentTaskNotFound
   */
  const parentTask = tasks.get(params.parentTaskId);
  if (!parentTask) {
    throw new Error('parentTaskNotFound');
  }

  /**
   * @validation Verify parent task is not completed
   * @throw {Error} parentTaskCompleted
   */
  if (parentTask.status === 'concluída') {
    throw new Error('parentTaskCompleted');
  }

  /**
   * @validation Verify subtask limit (max 10 per task)
   * @throw {Error} subtaskLimitReached
   */
  const existingSubtasks = Array.from(subtasks.values()).filter(
    (st) => st.parentTaskId === params.parentTaskId
  );
  if (existingSubtasks.length >= 10) {
    throw new Error('subtaskLimitReached');
  }

  const id = `subtask-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  /**
   * @rule {be-database-requirement} Inherit due date from parent task
   */
  const subtask: SubtaskEntity = {
    id,
    parentTaskId: params.parentTaskId,
    title: params.title,
    description: params.description,
    status: 'pendente',
    dueDate: parentTask.dueDate,
    createdAt: new Date(),
  };

  subtasks.set(id, subtask);
  return subtask;
}

/**
 * @summary
 * Lists all available task templates (system and user custom)
 *
 * @function templateList
 * @module task
 *
 * @returns {Promise<TemplateEntity[]>} List of available templates
 *
 * @example
 * const templates = await templateList();
 */
export async function templateList(): Promise<TemplateEntity[]> {
  return Array.from(templates.values());
}

/**
 * @summary
 * Creates a new task from a template with optional field overrides
 *
 * @function taskCreateFromTemplate
 * @module task
 *
 * @param {TaskFromTemplateRequest} params - Template-based task creation parameters
 *
 * @returns {Promise<{task: TaskEntity, subtasks: SubtaskEntity[]}>} Created task and subtasks
 *
 * @throws {Error} When template not found or missing required fields
 *
 * @example
 * const result = await taskCreateFromTemplate({
 *   templateId: 'template-project',
 *   overrides: { title: 'New Project', priority: 'alta' }
 * });
 */
export async function taskCreateFromTemplate(
  params: TaskFromTemplateRequest
): Promise<{ task: TaskEntity; subtasks: SubtaskEntity[] }> {
  /**
   * @validation Verify template exists
   * @throw {Error} templateNotFound
   */
  const template = templates.get(params.templateId);
  if (!template) {
    throw new Error('templateNotFound');
  }

  /**
   * @validation Verify template has title or override provides title
   * @throw {Error} templateMissingTitle
   */
  if (!template.predefinedFields.title && !params.overrides.title) {
    throw new Error('templateMissingTitle');
  }

  /**
   * @rule {be-database-requirement} Merge template fields with overrides
   */
  const taskData: TaskCreateRequest = {
    title: params.overrides.title || template.predefinedFields.title || '',
    description: params.overrides.description ?? template.predefinedFields.description ?? null,
    dueDate: params.overrides.dueDate ?? template.predefinedFields.dueDate ?? null,
    priority: params.overrides.priority || template.predefinedFields.priority || 'média',
    tags: params.overrides.tags || template.predefinedFields.tags || [],
    assignedUsers: params.overrides.assignedUsers || template.predefinedFields.assignedUsers || [],
  };

  const task = await taskCreate(taskData);

  /**
   * @rule {be-database-requirement} Create predefined subtasks from template
   */
  const createdSubtasks: SubtaskEntity[] = [];
  for (const subtaskTemplate of template.predefinedSubtasks) {
    const subtask = await subtaskCreate({
      parentTaskId: task.id,
      title: subtaskTemplate.title,
      description: subtaskTemplate.description,
    });
    createdSubtasks.push(subtask);
  }

  return { task, subtasks: createdSubtasks };
}
