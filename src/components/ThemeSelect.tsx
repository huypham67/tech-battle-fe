import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeSelect() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const label = isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối';

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={label}
      title={label}
      onClick={toggleTheme}
    >
      {isDark ? (
        <Sun aria-hidden="true" size={18} strokeWidth={2} />
      ) : (
        <Moon aria-hidden="true" size={18} strokeWidth={2} />
      )}
    </button>
  );
}
