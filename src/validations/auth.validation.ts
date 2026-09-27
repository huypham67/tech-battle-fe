import * as yup from 'yup';

export const registerSchema = yup.object({
  displayName: yup.string().max(100, 'Tên hiển thị tối đa 100 ký tự.').defined(),
  email: yup.string().required('Email là bắt buộc.').email('Email không hợp lệ.'),
  password: yup
    .string()
    .required('Mật khẩu là bắt buộc.')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự.')
    .max(100, 'Mật khẩu tối đa 100 ký tự.'),
  passwordConfirmation: yup
    .string()
    .required('Vui lòng xác nhận mật khẩu.')
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp.'),
});

export const loginSchema = yup.object({
  email: yup.string().required('Email là bắt buộc.').email('Email không hợp lệ.'),
  password: yup.string().required('Mật khẩu là bắt buộc.'),
});

export type RegisterFormValues = yup.InferType<typeof registerSchema>;
export type LoginFormValues = yup.InferType<typeof loginSchema>;
