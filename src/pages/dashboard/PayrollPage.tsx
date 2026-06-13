import { useTranslation } from 'react-i18next';

export function PayrollPage() {
  const { t } = useTranslation();

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{t('dashboard.sidebar.sections.payroll')}</p>
        <h2 className="text-2xl font-semibold">{t('dashboard.sidebar.sections.payroll')}</h2>
        <p className="text-sm text-muted-foreground">{t('dashboard.payrollDescription')}</p>
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">
        Salary, payslip, and payment history widgets will live here.
      </div>
    </section>
  );
}
