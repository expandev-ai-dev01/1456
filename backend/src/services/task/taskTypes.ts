/**
 * @interface TaskCreateRequest
 * @description Request parameters for creating a new task
 *
 * @property {string} title - Task title
 * @property {string | null} description - Task description
 * @property {string | null} dueDate - Task due date
 * @property {string} priority - Task priority (alta, média, baixa)
 * @property {string[]} tags - Task tags
 * @property {string[]} assignedUsers - Assigned user IDs
 */
export interface TaskCreateRequest {
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: 'alta' | 'média' | 'baixa';
  tags: string[];
  assignedUsers: string[];
}

/**
 * @interface TaskQuickCreateRequest
 * @description Request parameters for quick task creation
 *
 * @property {string} title - Task title
 */
export interface TaskQuickCreateRequest {
  title: string;
}

/**
 * @interface SubtaskCreateRequest
 * @description Request parameters for creating a subtask
 *
 * @property {string} parentTaskId - Parent task identifier
 * @property {string} title - Subtask title
 * @property {string | null} description - Subtask description
 */
export interface SubtaskCreateRequest {
  parentTaskId: string;
  title: string;
  description: string | null;
}

/**
 * @interface TaskFromTemplateRequest
 * @description Request parameters for creating task from template
 *
 * @property {string} templateId - Template identifier
 * @property {object} overrides - Field overrides for template values
 */
export interface TaskFromTemplateRequest {
  templateId: string;
  overrides: Partial<TaskCreateRequest>;
}

/**
 * @interface TaskEntity
 * @description Represents a task entity in the system
 *
 * @property {string} id - Unique task identifier
 * @property {string} title - Task title
 * @property {string | null} description - Task description
 * @property {string | null} dueDate - Task due date
 * @property {string} priority - Task priority
 * @property {string[]} tags - Task tags
 * @property {string[]} assignedUsers - Assigned user IDs
 * @property {string} status - Task status
 * @property {Date} createdAt - Creation timestamp
 */
export interface TaskEntity {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: string;
  tags: string[];
  assignedUsers: string[];
  status: string;
  createdAt: Date;
}

/**
 * @interface SubtaskEntity
 * @description Represents a subtask entity in the system
 *
 * @property {string} id - Unique subtask identifier
 * @property {string} parentTaskId - Parent task identifier
 * @property {string} title - Subtask title
 * @property {string | null} description - Subtask description
 * @property {string} status - Subtask status
 * @property {string | null} dueDate - Inherited due date
 * @property {Date} createdAt - Creation timestamp
 */
export interface SubtaskEntity {
  id: string;
  parentTaskId: string;
  title: string;
  description: string | null;
  status: string;
  dueDate: string | null;
  createdAt: Date;
}

/**
 * @interface TemplateEntity
 * @description Represents a task template entity
 *
 * @property {string} id - Unique template identifier
 * @property {string} name - Template name
 * @property {string | null} description - Template description
 * @property {string} type - Template type (padrão, personalizado)
 * @property {object} predefinedFields - Predefined field values
 * @property {Array} predefinedSubtasks - Predefined subtasks
 */
export interface TemplateEntity {
  id: string;
  name: string;
  description: string | null;
  type: 'padrão' | 'personalizado';
  predefinedFields: Partial<TaskCreateRequest>;
  predefinedSubtasks: Array<{ title: string; description: string | null }>;
}
