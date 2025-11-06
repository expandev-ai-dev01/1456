import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/response';
import { taskCreateFromTemplate, templateList } from '@/services/task';

/**
 * @api {get} /api/v1/internal/template List Templates
 * @apiName ListTemplates
 * @apiGroup Template
 * @apiVersion 1.0.0
 *
 * @apiDescription Lists all available task templates (system and user custom)
 *
 * @apiSuccess {Array} templates List of available templates
 *
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const templates = await templateList();
    res.json(successResponse(templates));
  } catch (error: any) {
    next(error);
  }
}

/**
 * @api {post} /api/v1/internal/template Create Task from Template
 * @apiName CreateTaskFromTemplate
 * @apiGroup Template
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new task from a template with optional field modifications
 *
 * @apiParam {String} templateId Template identifier
 * @apiParam {Object} [overrides] Field overrides for template values
 *
 * @apiSuccess {String} id Task identifier
 * @apiSuccess {String} title Task title
 * @apiSuccess {Object} task Complete task object
 * @apiSuccess {Array} subtasks Created subtasks from template
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} BusinessRuleError Business rule violation
 * @apiError {String} ServerError Internal server error
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  /**
   * @validation Validate request body for template-based task creation
   * @throw {ValidationError}
   */
  const bodySchema = z.object({
    templateId: z.string().min(1, 'templateIdRequired'),
    overrides: z
      .object({
        title: z.string().min(3).max(100).optional(),
        description: z.string().max(1000).nullable().optional(),
        dueDate: z.string().datetime().nullable().optional(),
        priority: z.enum(['alta', 'média', 'baixa']).optional(),
        tags: z.array(z.string().max(20)).max(5).optional(),
        assignedUsers: z.array(z.string()).max(5).optional(),
      })
      .optional(),
  });

  try {
    const validated = bodySchema.parse(req.body);

    /**
     * @rule {be-database-requirement} Create task from template with overrides
     */
    const result = await taskCreateFromTemplate({
      templateId: validated.templateId,
      overrides: validated.overrides || {},
    });

    res.status(201).json(successResponse(result));
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json(errorResponse(error.errors[0].message, 'VALIDATION_ERROR', error.errors));
    } else if (error.message === 'templateNotFound') {
      res.status(404).json(errorResponse('templateNotFound', 'NOT_FOUND'));
    } else if (error.message === 'templateMissingTitle') {
      res.status(400).json(errorResponse('templateMissingTitle', 'BUSINESS_RULE_ERROR'));
    } else {
      next(error);
    }
  }
}
