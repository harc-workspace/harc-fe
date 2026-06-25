import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, CalendarDays, Clock, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeaveBalanceCard } from '@/components/dashboard/LeaveBalanceCard';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

// Örnek Senaryo Verisi (Gerçekte API'lerden birleştirilecek)
const mockEvents = {
  myLeaves: [
    { id: 1, type: 'annual', status: 'approved', start: '2026-06-15', end: '2026-06-19', label: 'Yaz Tatili' },
    { id: 2, type: 'casual', status: 'pending', start: '2026-06-29', end: '2026-06-29', label: 'Diş Randevusu' },
    { id: 3, type: 'medical', status: 'approved', start: '2026-05-12', end: '2026-05-13', label: 'Geçmiş Sağlık İzni' } // Geçmiş izinleriniz gözükür
  ],
  teamFutureLeaves: [
    { id: 101, user: 'Ahmet Y.', start: '2026-06-25', end: '2026-06-26', label: 'Yıllık İzin' }, // Gelecekteki ekip izni
    { id: 102, user: 'Elif K.', start: '2026-07-02', end: '2026-07-03', label: 'Eğitim İzni' }
  ],
  holidays: [
    { id: 201, date: '2026-06-24', label: 'Resmi Tatil Örneği' } // Bugün için örnek resmi tatil
  ]
};

export function TimeOffPage() {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // Haziran 2026 Sabitlendi (Mock için)

  // Basit Takvim Günleri Hesaplama Matrisi (Grid için)
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  // Pazar gününü haftanın sonu yapmak için ufak ayarlama (Pzt=0, Sal=1... Paz=6)
  const adjustedFirstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const calendarCells = [];
  // Boş hücreler (Ayın başladığı günden öncesi)
  for (let i = 0; i < adjustedFirstDayIndex; i++) {
    calendarCells.push({ day: null, dateString: '' });
  }
  // Ayın günleri
  for (let i = 1; i <= daysInMonth; i++) {
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(i).padStart(2, '0');
    calendarCells.push({
      day: i,
      dateString: `${currentDate.getFullYear()}-${month}-${day}`
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ÜST BAŞLIK ALANI */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{t('dashboard.sidebar.sections.timeOff')}</h2>
          <p className="text-sm text-muted-foreground">Tüm izin süreçlerinizi, ekip çakışmalarını ve takvimi tek bir ekrandan yönetin.</p>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="gap-2 shadow-sm cursor-pointer">
              <Plus className="h-4 w-4" />
              Yeni İzin Talebi
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[500px]">
            <SheetHeader>
              <SheetTitle>İzin Talebi Oluştur</SheetTitle>
              <SheetDescription>Tarih aralığı seçerken takvimdeki çakışmaları göz önünde bulundurabilirsiniz.</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <p className="text-xs text-muted-foreground">Buraya tarih seçici ve izin türü form alanları gelecektir.</p>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* ANA GRID YERLEŞİMİ */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
        
        {/* SOL KOLON: Özet Bilgiler ve Renk Anahtarı (Legend) */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-24">
          <LeaveBalanceCard />

          {/* RENK ANAHTARI (LEGEND) */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-3 shadow-sm">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Takvim Haritası</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-primary" />
                <span className="font-medium">İzinlerim (Onaylı)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded border border-dashed border-primary/80 bg-primary/10" />
                <span className="font-medium text-muted-foreground">İzin Taleplerim (Onay Bekleyen)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-blue-100 dark:bg-blue-950 border border-blue-200 text-blue-700" />
                <span className="font-medium">Ekibimin İzinleri (Sadece Gelecek)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-emerald-100/70 dark:bg-emerald-950/40 border border-emerald-200" />
                <span className="font-medium">Resmi Tatiller / Şirket Kapalı</span>
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ KOLON: BİRLEŞİK DEV TAKVİM */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          
          {/* TAKVİM KONTROLLERİ (AY DEĞİŞTİRME) */}
          <div className="flex items-center justify-between border-b border-border p-4 bg-muted/20">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">
                {currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
              </h3>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon-sm" className="cursor-pointer">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon-sm" className="cursor-pointer">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* TAKVİM GRID ALANI */}
          <div className="grid grid-cols-7 border-b border-border bg-muted/40 text-center text-[11px] font-medium text-muted-foreground uppercase tracking-wider py-2">
            <div>Pzt</div><div>Sal</div><div>Çar</div><div>Per</div><div>Cum</div><div className="text-rose-500">Cmt</div><div className="text-rose-500">Paz</div>
          </div>

          <div className="grid grid-cols-7 bg-grid divide-x divide-y divide-border/60 border-t-0 border-l-0">
            {calendarCells.map((cell, index) => {
              // Gün hücresine denk gelen etkinlikleri filtrele
              const hasHoliday = mockEvents.holidays.find(h => h.date === cell.dateString);
              
              const myLeave = mockEvents.myLeaves.find(l => 
                cell.dateString >= l.start && cell.dateString <= l.end
              );
              
              const teamLeave = mockEvents.teamFutureLeaves.find(t => 
                cell.dateString >= t.start && cell.dateString <= t.end
              );

              return (
                <div 
                  key={index} 
                  className={`min-h-[105px] p-1.5 flex flex-col gap-1 transition-colors relative ${
                    !cell.day ? 'bg-muted/10 opacity-40 pointer-events-none' : 'bg-background hover:bg-muted/10'
                  } ${hasHoliday ? 'bg-emerald-50/40 dark:bg-emerald-950/10' : ''}`}
                >
                  {/* Gün Numarası ve Resmi Tatil İsmi */}
                  <div className="flex justify-between items-start w-full">
                    <span className={`text-xs font-semibold p-0.5 min-w-[20px] text-center ${
                      index % 7 === 5 || index % 7 === 6 ? 'text-rose-500/80' : 'text-foreground'
                    }`}>
                      {cell.day}
                    </span>
                    {hasHoliday && (
                      <span className="text-[9px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-1 rounded truncate max-w-[80px]">
                        {hasHoliday.label}
                      </span>
                    )}
                  </div>

                  {/* ETKİNLİK KATMANLARI (Ayrıştırılmış Barlar) */}
                  <div className="flex flex-col gap-1 mt-auto w-full">
                    
                    {/* 1. Sizin İzinleriniz */}
                    {myLeave && (
                      <div className={`text-[10px] p-1 rounded font-medium truncate shadow-xs flex items-center gap-1 ${
                        myLeave.status === 'approved' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-primary/10 text-primary border border-dashed border-primary/60'
                      }`}>
                        {myLeave.status === 'pending' && <Clock className="h-2.5 w-2.5 shrink-0 animate-pulse" />}
                        <span>{myLeave.label}</span>
                      </div>
                    )}

                    {/* 2. Ekip Arkadaşlarından Gelen Gelecek İzinler */}
                    {teamLeave && !myLeave && (
                      <div className="text-[10px] p-1 bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-300 rounded font-medium truncate flex items-center gap-1">
                        <span className="size-3.5 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center text-[8px] font-bold text-blue-800 dark:text-blue-200">
                          {teamLeave.user.charAt(0)}
                        </span>
                        <span className="truncate">{teamLeave.user} ({teamLeave.label})</span>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}