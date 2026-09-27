import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useState, type SubmitEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getCurrentUser } from '@/api/users.api';
import { clearAccessToken, setAccessToken } from '@/lib/auth';
import { useLoginMutation } from '@/queries/auth.queries';
import { queryKeys } from '@/queries/queryKeys';
import { ROUTES } from '@/routes/paths';
import { loginSchema } from '@/validations/auth.validation';
import { validateSchema } from '@/validations/validation.utils';

export default function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const loginMutation = useLoginMutation();

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});

    const result = validateSchema(loginSchema, {
      email,
      password,
    });

    if (!result.success) {
      setFieldErrors(result.errors);
      return;
    }

    loginMutation.mutate(result.data, {
      onSuccess: async ({ accessToken }) => {
        setAccessToken(accessToken);

        try {
          await queryClient.fetchQuery({
            queryKey: queryKeys.currentUser,
            queryFn: getCurrentUser,
          });
          toast.success('Đăng nhập thành công.');
          navigate(ROUTES.home);
        } catch (error) {
          clearAccessToken();
          queryClient.removeQueries({ queryKey: queryKeys.currentUser });
          toast.error(
            error instanceof Error
              ? error.message
              : 'Không thể tải thông tin tài khoản. Vui lòng thử lại.',
          );
        }
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : 'Không thể đăng nhập. Vui lòng thử lại.',
        );
      },
    });
  }

  function handleGoogle() {
    console.log('Login with Google');
  }

  return (
    <main className="auth-page" aria-labelledby="auth-title">
      <section className="auth-panel" aria-label="Đăng nhập">
        <div className="auth-panel__heading">
          <p className="auth-panel__kicker">Tech Battle</p>

          <h2 id="auth-title">Chào mừng trở lại</h2>

          <p>Nhập thông tin để vào lại tài khoản.</p>
        </div>

        <button className="auth-provider" type="button" onClick={handleGoogle}>
          <span className="google-mark" aria-hidden="true">
            G
          </span>

          <span>Tiếp tục với Google</span>
        </button>

        <div className="auth-divider" aria-hidden="true">
          <span>hoặc bằng email</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="auth-field" htmlFor="email">
            <span>Email</span>

            <div className="auth-input-wrap">
              <Mail aria-hidden="true" size={17} />

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </label>
          {fieldErrors.email && (
            <p className="auth-error" role="alert">
              {fieldErrors.email}
            </p>
          )}

          <label className="auth-field" htmlFor="password">
            <span>Mật khẩu</span>

            <div className="auth-input-wrap">
              <LockKeyhole aria-hidden="true" size={17} />

              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Ít nhất 8 ký tự"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <button
                className="auth-password-toggle"
                type="button"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" size={17} />
                ) : (
                  <Eye aria-hidden="true" size={17} />
                )}
              </button>
            </div>
          </label>
          {fieldErrors.password && (
            <p className="auth-error" role="alert">
              {fieldErrors.password}
            </p>
          )}

          <button className="auth-submit" type="submit" disabled={loginMutation.isPending}>
            <span>{loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}</span>
            <ArrowRight aria-hidden="true" size={17} />
          </button>
        </form>

        <p className="auth-switch">
          Chưa có tài khoản? <Link to={ROUTES.register}>Đăng ký</Link>
        </p>
      </section>
    </main>
  );
}
