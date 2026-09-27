import * as yup from 'yup';

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> };

export function getFieldErrors(error: yup.ValidationError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  const issues = error.inner.length > 0 ? error.inner : [error];

  for (const issue of issues) {
    if (issue.path && !fieldErrors[issue.path]) {
      fieldErrors[issue.path] = issue.message;
    }
  }

  return fieldErrors;
}

export function validateSchema<T>(schema: yup.Schema<T>, values: unknown): ValidationResult<T> {
  try {
    return {
      success: true,
      data: schema.validateSync(values, { abortEarly: false }),
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return {
        success: false,
        errors: getFieldErrors(error),
      };
    }

    throw error;
  }
}
