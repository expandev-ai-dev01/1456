import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/response';
import { subtaskCreate } from '@/services/task';

/**
 * @api {post} /api/v1/internal/subtask Create Subtask
 * @apiName CreateSubtask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new subtask associated with a parent task
 *
 * @apiParam {String} parentTaskId Parent task identifier
 * @apiParam {String} title Subtask title (3-100 characters)
 * @apiParam {String} [description] Subtask description (max 500 characters)
 *
 * @apiSuccess {String} id Subtask identifier
 * @apiSuccess {String} parentTaskId Parent task identifier
 * @apiSuccess {String} title Subtask title
 * @apiSuccess {String} description Subtask description
 * @apiSuccess {String} status Subtask status (default: pendente)
 * @apiSuccess {Date} dueDate Inherited due date from parent task
 * @apiSuccess {Date} createdAt Creation timestamp
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} BusinessRuleError Business rule violation
 * @apiError {String} ServerError Internal server error
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  /**
   * @validation Validate request body for subtask creation
   * @throw {ValidationError}
   */
  const bodySchema = z.object({
    parentTaskId: z.string().min(1, 'parentTaskIdRequired'),
    title: z.string().min(3, 'titleTooShort').max(100, 'titleTooLong'),
    description: z.string().max(500, 'descriptionTooLong').nullable().optional(),
  });

  try {
    const validated = bodySchema.parse(req.body);

    /**
     * @rule {be-database-requirement} Create subtask with parent task association
     */
    const subtask = await subtaskCreate({
      parentTaskId: validated.parentTaskId,
      title: validated.title,
      description: validated.description || null,
    });

    res.status(201).json(successResponse(subtask));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json(errorResponse(error.errors[0].message, 'VALIDATION_ERROR', error.errors));
    } else if (error.message === 'parentTaskNotFound') {
      res.status(404).json(errorResponse('parentTaskNotFound', 'NOT_FOUND'));
    } else if (error.message === 'parentTaskCompleted') {
      res.status(400).json(errorResponse('parentTaskCompleted', 'BUSINESS_RULE_ERROR'));
    } else if (error.message === 'subtaskLimitReached') {
      res.status(400).json(errorResponse('subtaskLimitReached', 'BUSINESS_RULE_ERROR'));
    } else {
      next(error);
    }
  }
}
