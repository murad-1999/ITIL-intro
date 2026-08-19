import { RoadmapPayloadSchema, type RoadmapPayload } from '../types/schema';
import { ZodError, ZodIssue } from 'zod';

export class ValidationError extends Error {
  public errors: { path: string; message: string }[];

  constructor(zodError: ZodError) {
    const formattedErrors = zodError.issues.map((err: ZodIssue) => ({
      path: err.path.join('.'),
      message: err.message
    }));
    
    const message = `Roadmap validation failed:\n${formattedErrors
      .map((e: { path: string; message: string }) => `  - [${e.path}]: ${e.message}`)
      .join('\n')}`;
      
    super(message);
    this.name = 'ValidationError';
    this.errors = formattedErrors;
  }
}

/**
 * Validates raw roadmap payload data against the Zod schema.
 * Throws ValidationError if the payload is malformed.
 */
export function validateRoadmapPayload(data: unknown): RoadmapPayload {
  const result = RoadmapPayloadSchema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(result.error);
  }
  return result.data;
}
