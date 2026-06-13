import { LoginForm } from '@/components/LoginForm';
import { Empty } from '@/components/ui/empty';
import { useTranslation } from 'react-i18next';

export function LoginPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-background px-4 py-6">
      <Empty className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-sm items-center justify-center border-0 bg-transparent p-0">
        <div className="flex w-full flex-col items-center gap-6">
          <div className="space-y-2 text-center">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {t('login.title')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('login.subtitle')}
            </p>
          </div>

          <LoginForm />
        </div>
      </Empty>
    </main>
  );
}
