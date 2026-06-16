
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaneTakeoff, Info } from "lucide-react";
import { useGetMyLeaveBalance } from "@/hooks/useGetMyLeaveBalance";

export function LeaveBalanceCard() {
  const { t, i18n } = useTranslation();
  const { data: balance, isLoading: isBalanceLoading } = useGetMyLeaveBalance();

  const progressPercent = balance?.totalLeaveQuota 
    ? Math.min((balance.usedLeaveDays / balance.totalLeaveQuota) * 100, 100) 
    : 0;

  return (
    <Card className="w-full rounded-sm relative overflow-hidden group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{t('dashboard.leaveCard.title')}</CardTitle>
        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full transition-colors group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50">
          <PlaneTakeoff className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
      </CardHeader>
      <CardContent>
        {isBalanceLoading ? (
          <div className="space-y-3 mt-2">
            <div className="h-10 w-24 animate-pulse bg-muted rounded" />
            <div className="h-4 w-full animate-pulse bg-muted rounded" />
            <div className="h-2 w-full animate-pulse bg-muted rounded-full mt-4" />
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground tracking-tight">
                {balance?.remainingLeaveDays ?? 0}
              </span>
              <span className="text-sm text-muted-foreground font-medium">
                {t('dashboard.leaveCard.daysLeft')}
              </span>
            </div>
            
            <div className="text-xs text-muted-foreground mt-3 flex justify-between">
              <span>{t('dashboard.leaveCard.used')}: <strong className="text-foreground">{balance?.usedLeaveDays ?? 0} {t('dashboard.leaveCard.days')}</strong></span>
              <span>{t('dashboard.leaveCard.total')}: <strong className="text-foreground">{balance?.totalLeaveQuota ?? 0} {t('dashboard.leaveCard.days')}</strong></span>
            </div>
            
            {/* İzin Tüketim Barı */}
            <div className="w-full bg-secondary h-2.5 rounded-full mt-2.5 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${
                  progressPercent > 80 ? 'bg-rose-500' : progressPercent > 50 ? 'bg-amber-400' : 'bg-emerald-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Dinamik Gelecek Hakediş Bilgilendirmesi */}
            {balance && balance.totalLeaveQuota > 0 && (
              <div className="mt-5 flex items-start gap-2 rounded-md bg-blue-50 dark:bg-blue-950/40 p-2.5 text-xs text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <p className="leading-relaxed">
                  {t('dashboard.leaveCard.nextAllowanceInfo', {
                    days: balance.daysUntilNextAnniversary,
                    date: new Date(balance.nextAnniversaryDate).toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US'),
                    amount: balance.nextAllowanceAmount
                  })}
                </p>
              </div>
            )}

            {/* Henüz 1 yılını doldurmamış kişi için uyarı */}
            {balance?.totalLeaveQuota === 0 && (
              <p className="text-[10px] text-amber-600 dark:text-amber-500 mt-3 font-medium bg-amber-50 dark:bg-amber-950/30 p-2 rounded border border-amber-100 dark:border-amber-900/50">
                {t('dashboard.leaveCard.waitingFirstYear')}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}