import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, CalendarDays, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeaveBalanceCard } from '@/components/dashboard/LeaveBalanceCard';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { toast } from "sonner"

// --- Örnek Senaryo Verisi ---
const mockEvents = {
  myLeaves: [
    { id: 1, type: 'annual', status: 'approved', start: '2026-06-15', end: '2026-06-19', label: 'Yaz Tatili' },
    { id: 2, type: 'casual', status: 'pending', start: '2026-06-29', end: '2026-06-29', label: 'Diş Randevusu' },
    { id: 3, type: 'medical', status: 'approved', start: '2026-05-12', end: '2026-05-13', label: 'Geçmiş Sağlık İzni' }
  ],
  teamFutureLeaves: [
    { id: 101, user: 'Ahmet Y.', start: '2026-06-25', end: '2026-06-26', label: 'Yıllık İzin' },
    { id: 102, user: 'Elif K.', start: '2026-07-02', end: '2026-07-03', label: 'Eğitim İzni' }
  ],
  holidays: [
    { id: 201, date: '2026-06-24', label: 'Resmi Tatil Örneği' }
  ]
};

type CalendarCell = { day: number | null; dateString: string };

export function TimeOffPage() {
  const { t } = useTranslation();
  const [currentDate] = useState(new Date(2026, 5, 1)); // Haziran 2026 Sabitlendi

  // --- İzin Giriş ve Tarih Seçim State'leri ---
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);

  // Takvim matrisini oluşturma
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const adjustedFirstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  // Spread operatörü ve açık tip ile birleştiriyoruz
  const calendarCells: CalendarCell[] = [
    // 1. Kısım: Ay başındaki boşluklar (day: null)
    ...Array.from({ length: adjustedFirstDayIndex }, () => ({
      day: null,
      dateString: ''
    })),

    // 2. Kısım: Ayın gerçek günleri (day: number)
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const monthStr = String(currentDate.getMonth() + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      return {
        day,
        dateString: `${currentDate.getFullYear()}-${monthStr}-${dayStr}`
      };
    })
  ];

  // --- Çakışma Kontrol Fonksiyonu ---
  const checkOverlap = (startStr: string, endStr: string) => {
    return mockEvents.myLeaves.some(leave => {
      const maxStart = startStr > leave.start ? startStr : leave.start;
      const minEnd = endStr < leave.end ? endStr : leave.end;
      return maxStart <= minEnd; // Eğer matematiksel olarak kesişiyorlarsa true döner
    });
  };

  // --- Hücreye Tıklama Yönetimi ---
  const handleCellClick = (dateString: string) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      // Yeni seçim başlatılıyor veya eski seçim sıfırlanıyor
      if (checkOverlap(dateString, dateString)) {
        toast.error("Bu tarihte zaten bir izniniz bulunuyor!");
        return;
      }
      setRangeStart(dateString);
      setRangeEnd(null);
    } else {
      // Bitiş tarihi seçiliyor
      if (dateString < rangeStart) {
        // Eğer tıklanan tarih başlangıçtan önceyse, yeni başlangıç tarihi yapıyoruz
        if (checkOverlap(dateString, dateString)) {
          toast.error("Bu tarihte zaten bir izniniz bulunuyor!");
          return;
        }
        setRangeStart(dateString);
        setRangeEnd(null);
      } else {
        // Tüm aralıkta çakışma var mı kontrol et
        if (checkOverlap(rangeStart, dateString)) {
          toast.error("Seçtiğiniz tarih aralığında mevcut bir izninizle çakışma (onaylı/bekleyen) var!");
          return;
        }
        setRangeEnd(dateString);
      }
    }
  };

  const clearSelection = () => {
    setRangeStart(null);
    setRangeEnd(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <TimeOffHeader t={t} isSheetOpen={isSheetOpen} setIsSheetOpen={setIsSheetOpen} />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Sol Kolon */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-6 self-start h-fit">
          <LeaveBalanceCard />
          <CalendarLegend />
        </div>

        {/* Sağ Kolon: Birleşik Dev Takvim */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <CalendarControls currentDate={currentDate} />

          {/* Gün İsimleri */}
          <div className="grid grid-cols-7 border-b border-border bg-muted/40 text-center text-[11px] font-medium text-muted-foreground uppercase py-2">
            <div>Pzt</div><div>Sal</div><div>Çar</div><div>Per</div><div>Cum</div>
            <div className="text-rose-500">Cmt</div><div className="text-rose-500">Paz</div>
          </div>

          {/* Takvim Grid Alanı */}
          <div className="grid grid-cols-7 bg-grid divide-x divide-y divide-border/60 border-t-0 border-l-0">
            {calendarCells.map((cell, index) => (
              <CalendarDayCell
                key={index}
                cell={cell}
                index={index}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                onCellClick={handleCellClick}
                setIsSheetOpen={setIsSheetOpen}
                clearSelection={clearSelection}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface HeaderProps { t: any; isSheetOpen: boolean; setIsSheetOpen: (open: boolean) => void; }
function TimeOffHeader({ t, isSheetOpen, setIsSheetOpen }: HeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{t('dashboard.sidebar.sections.timeOff')}</h2>
        <p className="text-sm text-muted-foreground">Tüm izin süreçlerinizi, ekip çakışmalarını ve takvimi tek bir ekrandan yönetin.</p>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button className="gap-2 shadow-sm cursor-pointer" onClick={() => setIsSheetOpen(true)}>
            <Plus className="size-4" /> Yeni İzin Talebi
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-100 sm:w-125">
          <SheetHeader>
            <SheetTitle>İzin Talebi Oluştur</SheetTitle>
            <SheetDescription>Tarih aralığı seçerken takvimdeki çakışmaları göz önünde bulundurabilirsiniz.</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <p className="text-xs text-muted-foreground">Form alanları gelecektir.</p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function CalendarLegend() {
  const legendItems = [
    { label: 'İzinlerim (Onaylı)', classes: 'bg-primary' },
    { label: 'İzin Taleplerim (Onay Bekleyen)', classes: 'border border-dashed border-primary/80 bg-primary/10', textClass: 'text-muted-foreground' },
    { label: 'Ekibimin İzinleri (Sadece Gelecek)', classes: 'bg-blue-100 dark:bg-blue-950 border border-blue-200' },
    { label: 'Resmi Tatiller / Şirket Kapalı', classes: 'bg-emerald-100/70 dark:bg-emerald-950/40 border border-emerald-200' },
  ];

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3 shadow-sm">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Takvim Haritası</h4>
      <div className="space-y-2.5 text-xs">
        {legendItems.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={cn("size-3 rounded", item.classes)} />
            <span className={cn("font-medium", item.textClass)}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CalendarControls({ currentDate }: { currentDate: Date }) {
  return (
    <div className="flex items-center justify-between border-b border-border p-4 bg-muted/20">
      <div className="flex items-center gap-2">
        <CalendarDays className="size-4 text-primary" />
        <h3 className="font-semibold text-sm">
          {currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
        </h3>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon-sm" className="cursor-pointer"><ChevronLeft className="size-4" /></Button>
        <Button variant="outline" size="icon-sm" className="cursor-pointer"><ChevronRight className="size-4" /></Button>
      </div>
    </div>
  );
}

interface CellProps {
  cell: CalendarCell;
  index: number;
  rangeStart: string | null;
  rangeEnd: string | null;
  onCellClick: (dateStr: string) => void;
  setIsSheetOpen: (open: boolean) => void;
  clearSelection: () => void;
}

function CalendarDayCell({ cell, index, rangeStart, rangeEnd, onCellClick, setIsSheetOpen, clearSelection }: CellProps) {
  const hasHoliday = mockEvents.holidays.find(h => h.date === cell.dateString);
  const myLeave = mockEvents.myLeaves.find(l => cell.dateString >= l.start && cell.dateString <= l.end);
  const teamLeave = mockEvents.teamFutureLeaves.find(t => cell.dateString >= t.start && cell.dateString <= t.end);

  const isWeekend = index % 7 === 5 || index % 7 === 6;

  // Tarih seçim durumları
  const isSelectedStart = rangeStart === cell.dateString;
  const isSelectedEnd = rangeEnd === cell.dateString;
  const isWithinRange = rangeStart && rangeEnd && cell.dateString >= rangeStart && cell.dateString <= rangeEnd;

  return (
    <div
      onClick={() => cell.day && onCellClick(cell.dateString)}
      className={cn(
        "min-h-26.25 p-1.5 flex flex-col gap-1 transition-colors relative cursor-pointer select-none",
        !cell.day ? "bg-muted/10 opacity-40 pointer-events-none" : "bg-background hover:bg-muted/15",
        hasHoliday && "bg-emerald-50/40 dark:bg-emerald-950/10",
        isWithinRange && "bg-primary/15 dark:bg-primary/25", // Aralık renklendirmesi
        (isSelectedStart || isSelectedEnd) && "bg-primary/30 dark:bg-primary/40 ring-1 ring-primary" // Kenarların belirginleşmesi
      )}
    >
      {/* Tooltip Popup (Sadece Bitiş Tarihinde Çıkar) */}
      {isSelectedEnd && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 bg-popover text-popover-foreground border border-border p-1.5 rounded shadow-lg flex items-center gap-1.5 animate-in fade-in-0 zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()} // Hücre tıklamasını tetiklemesin
        >
          <Button
            size="xs"
            className="cursor-pointer font-medium text-[11px] h-6 px-2 bg-primary text-primary-foreground"
            onClick={() => setIsSheetOpen(true)}
          >
            İzin Talebi Oluştur
          </Button>
          <button
            className="text-xs text-muted-foreground hover:text-foreground px-1 cursor-pointer"
            onClick={clearSelection}
          >
            ✕
          </button>
        </div>
      )}

      {/* Gün Başlığı */}
      <div className="flex justify-between items-start w-full">
        <span className={cn("text-xs font-semibold p-0.5 min-w-5 text-center rounded-sm",
          isWeekend ? "text-rose-500/80" : "text-foreground",
          (isSelectedStart || isSelectedEnd) && "bg-primary text-primary-foreground"
        )}>
          {cell.day}
        </span>
        {hasHoliday && (
          <span className="text-[9px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-1 rounded truncate max-w-20">
            {hasHoliday.label}
          </span>
        )}
      </div>

      {/* İzin Barları */}
      <div className="flex flex-col gap-1 mt-auto w-full">
        {myLeave && (
          <div className={cn(
            "text-[10px] p-1 rounded font-medium truncate shadow-xs flex items-center gap-1",
            myLeave.status === 'approved'
              ? "bg-primary text-primary-foreground"
              : "bg-primary/10 text-primary border border-dashed border-primary/60"
          )}>
            {myLeave.status === 'pending' && <Clock className="size-2.5 shrink-0 animate-pulse" />}
            <span>{myLeave.label}</span>
          </div>
        )}

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
}