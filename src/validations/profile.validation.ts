import * as yup from 'yup';

export const profileSchema = yup.object({
  displayName: yup
    .string()
    .transform((value, originalValue) => {
      if (typeof originalValue === 'string' && originalValue.trim() === '') {
        return undefined;
      }

      return typeof value === 'string' ? value.trim() : value;
    })
    .min(2, 'Tên hiển thị phải có ít nhất 2 ký tự.')
    .max(100, 'Tên hiển thị tối đa 100 ký tự.')
    .optional(),
});
