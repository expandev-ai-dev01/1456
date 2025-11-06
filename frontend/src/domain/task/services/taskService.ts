import { authenticatedClient } from '@/core/lib/api';
import type {
  Task,
  Subtask,
  Template,
  CreateTaskDto,
  CreateQuickTaskDto,
  CreateSubtaskDto,
  CreateTaskFromTemplateDto,
} from '../types';
import type { ApiResponse } from '@/core/types';

/**
 * @service taskService
 * @summary Task management service for authenticated endpoints
 * @domain task
 * @type rest-service
 * @apiContext internal
 */
export const taskService = {
  /**
   * @endpoint POST /api/v1/internal/task
   * @summary Creates a new task with full details
   */
  async create(data: CreateTaskDto): Promise<Task> {
    const response = await authenticatedClient.post<ApiResponse<Task>>('/task', data);
    return response.data.data;
  },

  /**
   * @endpoint POST /api/v1/internal/task-quick
   * @summary Creates a quick task with only title
   */
  async createQuick(data: CreateQuickTaskDto): Promise<Task> {
    const response = await authenticatedClient.post<ApiResponse<Task>>('/task-quick', data);
    return response.data.data;
  },

  /**
   * @endpoint POST /api/v1/internal/subtask
   * @summary Creates a subtask for a parent task
   */
  async createSubtask(data: CreateSubtaskDto): Promise<Subtask> {
    const response = await authenticatedClient.post<ApiResponse<Subtask>>('/subtask', data);
    return response.data.data;
  },

  /**
   * @endpoint GET /api/v1/internal/template
   * @summary Lists all available templates
   */
  async listTemplates(): Promise<Template[]> {
    const response = await authenticatedClient.get<ApiResponse<Template[]>>('/template');
    return response.data.data;
  },

  /**
   * @endpoint POST /api/v1/internal/template
   * @summary Creates a task from a template
   */
  async createFromTemplate(
    data: CreateTaskFromTemplateDto
  ): Promise<{ task: Task; subtasks: Subtask[] }> {
    const response = await authenticatedClient.post<
      ApiResponse<{ task: Task; subtasks: Subtask[] }>
    >('/template', data);
    return response.data.data;
  },
};
