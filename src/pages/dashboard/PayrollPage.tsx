import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgeDollarSign, CalendarDays, Download, FileText, Wallet } from 'lucide-react';

// --- MOCK DATA ---
const mockSummary = {
  currentNet: '105.000 TL',
  nextPaymentDate: '31 Ağustos 2026',
  lastDeduction: '0 TL'
};

const mockPayrollHistory = [
  { id: 1, period: 'Temmuz 2026', gross: '150.000 TL', net: '105.000 TL', status: 'Ödendi', paymentDate: '31.07.2026' },
  { id: 2, period: 'Haziran 2026', gross: '120.000 TL', net: '85.000 TL', status: 'Ödendi', paymentDate: '30.06.2026' },
  { id: 3, period: 'Mayıs 2026', gross: '120.000 TL', net: '85.000 TL', status: 'Ödendi', paymentDate: '31.05.2026' },
];
// -----------------

export function PayrollPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      {/* Başlık Alanı */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{t('dashboard.sidebar.sections.payroll')}</p>
          <h2 className="text-2xl font-semibold">{t('dashboard.sidebar.sections.payroll')}</h2>
          <p className="text-sm text-muted-foreground">{t('dashboard.payrollDescription')}</p>
        </div>
      </section>

      {/* Özet Kartları (Summary Widgets) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Güncel Net Maaş</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSummary.currentNet}</div>
            <p className="text-xs text-muted-foreground mt-1">Temmuz 2026 itibarıyla</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sonraki Ödeme Tarihi</CardTitle>
            <CalendarDays className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSummary.nextPaymentDate}</div>
            <p className="text-xs text-muted-foreground mt-1">Düzenli maaş ödemesi</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Son Kesintiler</CardTitle>
            <BadgeDollarSign className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSummary.lastDeduction}</div>
            <p className="text-xs text-muted-foreground mt-1">Bu ay kesinti uygulanmadı</p>
          </CardContent>
        </Card>
      </div>

      {/* Bordro Geçmişi Listesi */}
      <Card className="rounded-xl shadow-sm overflow-hidden border border-border">
        <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
          <CardTitle>Bordro Geçmişi</CardTitle>
          <CardDescription>Geçmiş aylara ait maaş bordrolarınızı görüntüleyebilir ve indirebilirsiniz.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {mockPayrollHistory.map((slip) => (
              <div key={slip.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 hover:bg-muted/10 transition-colors gap-4">
                
                {/* Sol Kısım: İkon ve Dönem */}
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{slip.period}</p>
                    <p className="text-xs text-muted-foreground">Ödeme: {slip.paymentDate} • <span className="text-emerald-600 dark:text-emerald-400 font-medium">{slip.status}</span></p>
                  </div>
                </div>

                {/* Sağ Kısım: Maaş Tutarı ve Buton */}
                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-bold text-foreground">{slip.net}</p>
                    <p className="text-xs text-muted-foreground">Brüt: {slip.gross}</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">PDF İndir</span>
                  </Button>
                </div>

              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}