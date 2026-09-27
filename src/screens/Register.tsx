import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useState, type SubmitEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useRegisterMutation } from '@/queries/auth.queries';
import { ROUTES } from '@/routes/paths';
import { registerSchema } from '@/validations/auth.validation';
import { validateSchema } from '@/validations/validation.utils';

export default function Register() {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const registerMutation = useRegisterMutation();

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});

    const result = validateSchema(registerSchema, {
      displayName,
      email,
      password,
      passwordConfirmation,
    });

    if (!result.success) {
      setFieldErrors(result.errors);
      return;
    }

    registerMutation.mutate(
      {
        email: result.data.email,
        password: result.data.password,
        displayName: result.data.displayName || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Đăng ký tài khoản thành công.');
          navigate(ROUTES.login);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : 'Không thể tạo tài khoản. Vui lòng thử lại.',
          );
        },
      },
    );
  }

  function handleGoogle() {
    console.log('Register with Google');
  }

  return (
    <main className="auth-page" aria-labelledby="auth-title">
      <section className="auth-panel" aria-label="Đăng ký tài khoản">
        <div className="auth-panel__heading">
          <p className="auth-panel__kicker">Tech Battle</p>

          <h2 id="auth-title">Tạo tài khoản</h2>

          <p>Bắt đầu lưu những trận đấu và tiến độ đầu tiên.</p>
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
          <label className="auth-field" htmlFor="display-name">
            <span>Tên hiển thị</span>

            <div className="auth-input-wrap">
              <UserRound aria-hidden="true" size={17} />

              <input
                id="display-name"
                name="displayName"
                type="text"
                autoComplete="name"
                placeholder="Ví dụ: huydev"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
              />
            </div>
          </label>
          {fieldErrors.displayName && (
            <p className="auth-error" role="alert">
              {fieldErrors.displayName}
            </p>
          )}

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
                autoComplete="new-password"
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

          <label className="auth-field" htmlFor="password-confirmation">
            <span>Xác nhận mật khẩu</span>

            <div className="auth-input-wrap">
              <LockKeyhole aria-hidden="true" size={17} />

              <input
                id="password-confirmation"
                name="passwordConfirmation"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Nhập lại mật khẩu"
                value={passwordConfirmation}
                onChange={(event) => setPasswordConfirmation(event.target.value)}
              />
            </div>
          </label>
          {fieldErrors.passwordConfirmation && (
            <p className="auth-error" role="alert">
              {fieldErrors.passwordConfirmation}
            </p>
          )}

          <button className="auth-submit" type="submit" disabled={registerMutation.isPending}>
            <span>{registerMutation.isPending ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}</span>
            <ArrowRight aria-hidden="true" size={17} />
          </button>
        </form>

        <p className="auth-switch">
          Đã có tài khoản? <Link to={ROUTES.login}>Đăng nhập</Link>
        </p>
      </section>
    </main>
  );
}
