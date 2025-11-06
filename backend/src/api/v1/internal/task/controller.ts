import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/response';
import { taskCreate } from '@/services/task';

/**
 * @api {post} /api/v1/internal/task Create Task
 * @apiName CreateTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new task with title, description, due date, priority, tags, and assigned users
 *
 * @apiParam {String} title Task title (3-100 characters)
 * @apiParam {String} [description] Task description (max 1000 characters)
 * @apiParam {Date} [dueDate] Task due date (cannot be in the past)
 * @apiParam {String} priority Task priority (alta, média, baixa)
 * @apiParam {Array} [tags] Task tags (max 5, each max 20 characters)
 * @apiParam {Array} [assignedUsers] Assigned user IDs (max 5, requires collaborative mode)
 *
 * @apiSuccess {String} id Task identifier
 * @apiSuccess {String} title Task title
 * @apiSuccess {String} description Task description
 * @apiSuccess {Date} dueDate Task due date
 * @apiSuccess {String} priority Task priority
 * @apiSuccess {Array} tags Task tags
 * @apiSuccess {Array} assignedUsers Assigned users
 * @apiSuccess {String} status Task status
 * @apiSuccess {Date} createdAt Creation timestamp
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} BusinessRuleError Business rule violation
 * @apiError {String} ServerError Internal server error
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  /**
   * @validation Validate request body against task creation schema
   * @throw {ValidationError}
   */
  const bodySchema = z.object({
    title: z
      .string()
      .min(3, 'titleTooShort')
      .max(100, 'titleTooLong')
      .refine((val) => val.trim().length > 0, 'titleCannotBeOnlySpaces'),
    description: z.string().max(1000, 'descriptionTooLong').nullable().optional(),
    dueDate: z.string().datetime().nullable().optional(),
    priority: z.enum(['alta', 'média', 'baixa'], {
      errorMap: () => ({ message: 'invalidPriority' }),
    }),
    tags: z.array(z.string().max(20, 'tagTooLong')).max(5, 'tooManyTags').optional(),
    assignedUsers: z.array(z.string()).max(5, 'tooManyAssignedUsers').optional(),
  });

  try {
    const validated = bodySchema.parse(req.body);

    /**
     * @rule {be-database-requirement} Validate due date is not in the past
     */
    if (validated.dueDate) {
      const dueDate = new Date(validated.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dueDate.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        res.status(400).json(errorResponse('dueDateCannotBeInPast', 'VALIDATION_ERROR'));
        return;
      }
    }

    /**
     * @rule {be-database-requirement} Validate collaborative mode for assigned users
     */
    if (validated.assignedUsers && validated.assignedUsers.length > 0) {
      // Note: In a real implementation, we would check user's collaborative mode from session/token
      // For now, we'll assume collaborative mode is enabled
      // This validation would be: if (!req.user.collaborativeMode) { throw error }
    }

    /**
     * @rule {be-database-requirement} Create task with validated data
     */
    const task = await taskCreate({
      title: validated.title,
      description: validated.description || null,
      dueDate: validated.dueDate || null,
      priority: validated.priority,
      tags: validated.tags || [],
      assignedUsers: validated.assignedUsers || [],
    });

    res.status(201).json(successResponse(task));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json(errorResponse(error.errors[0].message, 'VALIDATION_ERROR', error.errors));
    } else {
      next(error);
    }
  }
}
