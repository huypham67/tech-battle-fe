import { ArrowLeft, BadgeCheck, Mail, Save, ShieldCheck, UserRound } from 'lucide-react';
import { useState, type SubmitEvent } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUserQuery, useUpdateCurrentProfileMutation } from '@/queries/auth.queries';
import { queryKeys } from '@/queries/queryKeys';
import { ROUTES } from '@/routes/paths';
import { profileSchema } from '@/validations/profile.validation';
import { validateSchema } from '@/validations/validation.utils';

function getInitials(displayName: string | null, email: string) {
  const label = displayName || email;

  return label
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function getRoleLabel(role: string) {
  return role === 'ADMIN' ? 'Quản trị viên' : 'Người chơi';
}

function getStatusLabel(status: string) {
  return status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm khóa';
}

export default function Profile() {
  const queryClient = useQueryClient();
  const currentUserQuery = useCurrentUserQuery();
  const updateProfileMutation = useUpdateCurrentProfileMutation();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const displayName = String(formData.get('displayName') ?? '');
    const result = validateSchema(profileSchema, { displayName });

    if (!result.success) {
      setFieldErrors(result.errors);
      return;
    }

    updateProfileMutation.mutate(result.data, {
      onSuccess: (updatedUser) => {
        queryClient.setQueryData(queryKeys.currentUser, updatedUser);
        toast.success('Đã cập nhật hồ sơ.');
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : 'Không thể cập nhật hồ sơ. Vui lòng thử lại.',
        );
      },
    });
  }

  if (currentUserQuery.isLoading) {
    return (
      <main className="profile-page profile-page--status">
        <div className="profile-status" role="status">
          <span className="profile-status__pulse" aria-hidden="true" />
          Đang tải hồ sơ...
        </div>
      </main>
    );
  }

  if (currentUserQuery.isError || !currentUserQuery.data) {
    return (
      <main className="profile-page profile-page--status">
        <section className="profile-empty" aria-labelledby="profile-empty-title">
          <span className="profile-empty__icon" aria-hidden="true">
            <UserRound size={22} />
          </span>
          <p className="eyebrow">Account</p>
          <h1 id="profile-empty-title">Đăng nhập để xem hồ sơ</h1>
          <p>Thông tin tài khoản và tiến độ của bạn sẽ xuất hiện ở đây.</p>
          <Link className="profile-action" to={ROUTES.login}>
            <ArrowLeft aria-hidden="true" size={17} />
            <span>Đi tới đăng nhập</span>
          </Link>
        </section>
      </main>
    );
  }

  const user = currentUserQuery.data;
  const initials = getInitials(user.displayName, user.email);

  return (
    <main className="profile-page" aria-labelledby="profile-title">
      <header className="profile-header">
        <Link className="profile-back-link" to={ROUTES.home}>
          <ArrowLeft aria-hidden="true" size={16} />
          <span>Về trang chủ</span>
        </Link>

        <div className="page-intro profile-page-intro">
          <p className="eyebrow">Account / Profile</p>
          <h1 id="profile-title">Hồ sơ của bạn</h1>
          <p>Giữ thông tin cá nhân luôn đúng với cách bạn xuất hiện trong các trận đấu.</p>
        </div>
      </header>

      <div className="profile-layout">
        <aside className="profile-summary" aria-label="Tổng quan tài khoản">
          <div className="profile-summary__topline">
            <span className="profile-summary__label">Tài khoản</span>
            <span className="profile-status-badge">
              <span className="status-dot" aria-hidden="true" />
              {getStatusLabel(user.status)}
            </span>
          </div>

          <div className="profile-avatar profile-avatar--large" aria-hidden="true">
            {initials}
          </div>

          <h2>{user.displayName || 'Chưa đặt tên'}</h2>
          <p className="profile-summary__email">
            <Mail aria-hidden="true" size={16} />
            <span>{user.email}</span>
          </p>

          <dl className="profile-details">
            <div className="profile-detail">
              <dt>Vai trò</dt>
              <dd>
                <BadgeCheck aria-hidden="true" size={16} />
                {getRoleLabel(user.role)}
              </dd>
            </div>
            <div className="profile-detail">
              <dt>Trạng thái</dt>
              <dd>
                <ShieldCheck aria-hidden="true" size={16} />
                {getStatusLabel(user.status)}
              </dd>
            </div>
          </dl>
        </aside>

        <section className="profile-editor" aria-labelledby="profile-editor-title">
          <div className="profile-editor__heading">
            <p className="profile-editor__kicker">Personal details</p>
            <h2 id="profile-editor-title">Thông tin cá nhân</h2>
            <p>Chỉ tên hiển thị có thể chỉnh sửa ở thời điểm này.</p>
          </div>

          <form className="profile-form" onSubmit={handleSubmit} noValidate>
            <label className="profile-field" htmlFor="profile-display-name">
              <span>Tên hiển thị</span>

              <div className="profile-input-wrap">
                <UserRound aria-hidden="true" size={18} />
                <input
                  id="profile-display-name"
                  name="displayName"
                  type="text"
                  autoComplete="name"
                  maxLength={100}
                  placeholder="Ví dụ: huydev"
                  defaultValue={user.displayName ?? ''}
                  onChange={() => {
                    setFieldErrors((errors) => {
                      if (!errors.displayName) {
                        return errors;
                      }

                      const next = { ...errors };
                      delete next.displayName;
                      return next;
                    });
                  }}
                />
              </div>
            </label>

            {fieldErrors.displayName && (
              <p className="auth-error" role="alert">
                {fieldErrors.displayName}
              </p>
            )}

            <div className="profile-form__note">
              <ShieldCheck aria-hidden="true" size={17} />
              <span>Email tài khoản: {user.email}</span>
            </div>

            <div className="profile-form__actions">
              <span>Thay đổi được lưu ngay vào tài khoản của bạn.</span>
              <button
                className="profile-submit"
                type="submit"
                disabled={updateProfileMutation.isPending}
              >
                <Save aria-hidden="true" size={17} />
                <span>{updateProfileMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
