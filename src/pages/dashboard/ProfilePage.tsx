import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

export function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { language } = useLanguage();

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{t('dashboard.sidebar.sections.profile')}</p>
        <h2 className="text-2xl font-semibold">{t('dashboard.sidebar.sections.profile')}</h2>
        <p className="text-sm text-muted-foreground">{t('dashboard.profileDescription')}</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t('dashboard.fields.name')}</p>
          <p className="mt-2 text-sm font-medium">{user?.fullName}</p>
        </div>
        <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t('dashboard.fields.email')}</p>
          <p className="mt-2 text-sm font-medium">{user?.email}</p>
        </div>
        <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t('dashboard.fields.role')}</p>
          <p className="mt-2 text-sm font-medium">{user?.role}</p>
        </div>
        <div className="rounded-xl border border-border/70 bg-muted/40 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t('dashboard.fields.roleDisplayName')}</p>
          <p className="mt-2 text-sm font-medium">{user?.roleDisplayName[language]}</p>
        </div>
      </div>
    </section>
  );
}
