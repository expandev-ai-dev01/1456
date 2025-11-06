import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/response';
import { taskQuickCreate } from '@/services/task';

/**
 * @api {post} /api/v1/internal/task-quick Quick Create Task
 * @apiName QuickCreateTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new task quickly with only title (default values for other fields)
 *
 * @apiParam {String} title Task title (3-100 characters)
 *
 * @apiSuccess {String} id Task identifier
 * @apiSuccess {String} title Task title
 * @apiSuccess {String} priority Task priority (default: média)
 * @apiSuccess {String} status Task status (default: pendente)
 * @apiSuccess {Date} createdAt Creation timestamp
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  /**
   * @validation Validate request body for quick task creation
   * @throw {ValidationError}
   */
  const bodySchema = z.object({
    title: z.string().min(3, 'titleTooShort').max(100, 'titleTooLong'),
  });

  try {
    const validated = bodySchema.parse(req.body);

    /**
     * @rule {be-database-requirement} Create quick task with default values
     */
    const task = await taskQuickCreate({
      title: validated.title,
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
