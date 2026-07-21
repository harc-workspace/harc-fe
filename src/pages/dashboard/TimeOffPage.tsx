import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, CalendarDays, Clock, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeaveBalanceCard } from '@/components/dashboard/LeaveBalanceCard';
import { cn } from '@/lib/utils';
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { LeaveType } from '@/enums/leaveType';
import { useCreateLeave } from '@/hooks/leave/useLeaveMutations';
import { useGetCalendarLeaves } from '@/hooks/leave/useGetCalendarLeaves';

type CalendarCell = { day: number | null; dateString: string };

export function TimeOffPage() {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const createLeaveMutation = useCreateLeave();

  const { data: calendarData, isLoading: isCalendarLoading } = useGetCalendarLeaves(
    currentDate.getFullYear(), 
    currentDate.getMonth() + 1
  );

  const myLeaves = calendarData?.myLeaves?.map(l => ({
    ...l,
    start: l.start.split('T')[0],
    end: l.end.split('T')[0]
  })) || [];
  const teamLeaves = calendarData?.teamLeaves?.map(l => ({
    ...l,
    start: l.start.split('T')[0],
    end: l.end.split('T')[0]
  })) || [];
  const holidays = calendarData?.holidays?.map(h => ({
    ...h,
    date: h.date.split('T')[0]
  })) || [];

  // --- İzin Giriş ve Tarih Seçim State'leri ---
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);
  const [leaveType, setLeaveType] = useState<string>('');
  const [description, setDescription] = useState('');
  const [documents, setDocuments] = useState<File[]>([]);

  // Takvim matrisini oluşturma
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const adjustedFirstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  useEffect(() => {
    if (isDialogOpen && rangeStart && rangeEnd) {
      const conflictingLeaves = teamLeaves.filter(leave => {
        const maxStart = rangeStart > leave.start ? rangeStart : leave.start;
        const minEnd = rangeEnd < leave.end ? rangeEnd : leave.end;
        return maxStart <= minEnd;
      });

      if (conflictingLeaves.length > 0) {
        const formatDateLabel = (dateStr: string) => {
          const [y, m, d] = dateStr.split('-');
          return `${d}.${m}.${y}`;
        };

        conflictingLeaves.forEach(conflict => {
          toast.info(
            `Ekip arkadaşınız ${conflict.user}, ${formatDateLabel(conflict.start)} - ${formatDateLabel(conflict.end)} tarihleri arasında izinli görünüyor. Aynı döneme izin talep ediyorsunuz, iş planlamasına bilginize!`, 
            { duration: 6000, position: "top-center" }
          );
        });
      }
    }
  }, [isDialogOpen, rangeStart, rangeEnd, teamLeaves]);

  const handlePrevMonth = () => {setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));};
  const handleNextMonth = () => { setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));};
  
  const calendarCells: CalendarCell[] = [
    ...Array.from({ length: adjustedFirstDayIndex }, () => ({
      day: null,
      dateString: ''
    })),
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

  const checkOverlap = (startStr: string, endStr: string) => {
    return myLeaves.some(leave => {
      const maxStart = startStr > leave.start ? startStr : leave.start;
      const minEnd = endStr < leave.end ? endStr : leave.end;
      return maxStart <= minEnd;
    });
  };

  const handleCellClick = (dateString: string) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      if (checkOverlap(dateString, dateString)) {
        toast.error("Bu tarihte zaten bir izniniz bulunuyor!");
        return;
      }
      setRangeStart(dateString);
      setRangeEnd(null);
    } else {
      if (dateString < rangeStart) {
        if (checkOverlap(dateString, dateString)) {
          toast.error("Bu tarihte zaten bir izniniz bulunuyor!");
          return;
        }
        setRangeStart(dateString);
        setRangeEnd(null);
      } else {
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

  const resetLeaveForm = () => {
    clearSelection();
    setLeaveType('');
    setDescription('');
    setDocuments([]);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetLeaveForm();
    }
  };

  const handleSubmitLeave = async () => {
    if (!rangeStart || !rangeEnd || !leaveType) {
      toast.error('Lütfen başlangıç, bitiş ve izin tipini doldurun.');
      return;
    }
    if (rangeEnd < rangeStart) {
      toast.error('Bitiş tarihi başlangıç tarihinden önce olamaz.');
      return;
    }
    await createLeaveMutation.mutateAsync({
      StartDate: rangeStart,
      EndDate: rangeEnd,
      LeaveType: Number(leaveType) as LeaveType,
      Description: description.trim() || null,
      Documents: documents,
    });
    setIsDialogOpen(false);
    resetLeaveForm();
  };

  return (
    <div className="flex flex-col gap-6">
      <TimeOffHeader
        t={t}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={handleDialogOpenChange}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        setRangeStart={setRangeStart}
        setRangeEnd={setRangeEnd}
        leaveType={leaveType}
        setLeaveType={setLeaveType}
        description={description}
        setDescription={setDescription}
        documents={documents}
        setDocuments={setDocuments}
        onSubmitLeave={handleSubmitLeave}
        isSubmitting={createLeaveMutation.isPending}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <div className="flex flex-col gap-6 lg:sticky lg:top-6 self-start h-fit">
          <LeaveBalanceCard />
          <CalendarLegend />
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden relative">
          <CalendarControls
            currentDate={currentDate}
            onPrev={handlePrevMonth}
            onNext={handleNextMonth}
          />
          
          <div className="grid grid-cols-7 border-b border-border bg-muted/40 text-center text-[11px] font-medium text-muted-foreground uppercase py-2">
            <div>Pzt</div><div>Sal</div><div>Çar</div><div>Per</div><div>Cum</div>
            <div className="text-rose-500">Cmt</div><div className="text-rose-500">Paz</div>
          </div>
          
          {isCalendarLoading ? (
            <div className="flex flex-col items-center justify-center min-h-100 text-muted-foreground">
              <Loader2 className="size-8 animate-spin mb-4 text-primary" />
              <p>Takvim verileri yükleniyor...</p>
            </div>
          ) : (
            <div className="grid grid-cols-7 bg-grid divide-x divide-y divide-border/60 border-t-0 border-l-0">
              {calendarCells.map((cell, index) => (
                <CalendarDayCell
                  key={index}
                  cell={cell}
                  index={index}
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  onCellClick={handleCellClick}
                  setIsDialogOpen={setIsDialogOpen}
                  myLeaves={myLeaves}
                  teamLeaves={teamLeaves}
                  holidays={holidays}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface HeaderProps {
  t: any;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  rangeStart: string | null;
  rangeEnd: string | null;
  setRangeStart: (val: string | null) => void;
  setRangeEnd: (val: string | null) => void;
  leaveType: string;
  setLeaveType: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  documents: File[];
  setDocuments: (files: File[]) => void;
  onSubmitLeave: () => Promise<void>;
  isSubmitting: boolean;
}

function TimeOffHeader({
  t,
  isDialogOpen,
  setIsDialogOpen,
  rangeStart,
  rangeEnd,
  setRangeStart,
  setRangeEnd,
  leaveType,
  setLeaveType,
  description,
  setDescription,
  documents,
  setDocuments,
  onSubmitLeave,
  isSubmitting,
}: HeaderProps) {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await onSubmitLeave();
    } catch {
      // Hook already reports the error with a toast.
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{t('dashboard.sidebar.sections.timeOff')}</h2>
        <p className="text-sm text-muted-foreground">Tüm izin süreçlerinizi, ekip çakışmalarını ve takvimi tek bir ekrandan yönetin.</p>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2 shadow-sm cursor-pointer" onClick={() => setIsDialogOpen(true)}>
            <Plus className="size-4" /> Yeni İzin Talebi
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>İzin Talebi Oluştur</DialogTitle>
            <DialogDescription>
              Tarih aralığı seçerken takvimdeki çakışmaları göz önünde bulundurabilirsiniz.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Başlangıç Tarihi <span className="text-destructive">*</span></Label>
                <Input
                  id="startDate"
                  type="date"
                  value={rangeStart || ""}
                  onChange={(e) => setRangeStart(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Bitiş Tarihi <span className="text-destructive">*</span></Label>
                <Input
                  id="endDate"
                  type="date"
                  value={rangeEnd || ""}
                  onChange={(e) => setRangeEnd(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leaveType">İzin Tipi <span className="text-destructive">*</span></Label>
              <Select value={leaveType} onValueChange={setLeaveType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Bir izin tipi seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={LeaveType.Annual.toString()}>Yıllık İzin</SelectItem>
                  <SelectItem value={LeaveType.Sick.toString()}>Hastalık İzni</SelectItem>
                  <SelectItem value={LeaveType.Excuse.toString()}>Mazeret İzni</SelectItem>
                  <SelectItem value={LeaveType.Unpaid.toString()}>Ücretsiz İzin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama (İsteğe Bağlı)</Label>
              <Textarea
                id="description"
                placeholder="İzin talebinizle ilgili eklemek istedikleriniz..."
                className="resize-none"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="documents">Ekler (İsteğe Bağlı)</Label>
              <Input
                id="documents"
                type="file"
                multiple
                onChange={(e) => setDocuments(Array.from(e.target.files ?? []))}
              />
              {documents.length > 0 && (
                <div className="rounded-lg border border-border bg-muted/20 p-3 text-xs text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">Seçilen dosyalar</p>
                  <ul className="space-y-1">
                    {documents.map((file) => (
                      <li key={`${file.name}-${file.size}`}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>İptal</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Gönderiliyor...' : 'Talep Oluştur'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
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

interface CalendarControlsProps {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
}

function CalendarControls({ currentDate, onPrev, onNext }: CalendarControlsProps) {
  return (
    <div className="flex items-center justify-between border-b border-border p-4 bg-muted/20">
      <div className="flex items-center gap-2">
        <CalendarDays className="size-4 text-primary" />
        <h3 className="font-semibold text-sm">
          {currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
        </h3>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon-sm" className="cursor-pointer" onClick={onPrev}>
          <ChevronLeft className="size-4" />
        </Button>
        <Button variant="outline" size="icon-sm" className="cursor-pointer" onClick={onNext}>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

const getLeaveTypeLabel = (type: number) => {
  switch (type) {
    case LeaveType.Annual: return 'Yıllık İzin';
    case LeaveType.Sick: return 'Hastalık İzni';
    case LeaveType.Excuse: return 'Mazeret İzni';
    case LeaveType.Unpaid: return 'Ücretsiz İzin';
    default: return 'İzin';
  }
};

interface CellProps {
  cell: CalendarCell;
  index: number;
  rangeStart: string | null;
  rangeEnd: string | null;
  onCellClick: (dateStr: string) => void;
  setIsDialogOpen: (open: boolean) => void;
  myLeaves: any[];
  teamLeaves: any[];
  holidays: any[];
}

function CalendarDayCell({ cell, index, rangeStart, rangeEnd, onCellClick, setIsDialogOpen, myLeaves, teamLeaves, holidays }: CellProps) {
  const hasHoliday = holidays.find(h => h.date === cell.dateString);
  const myLeave = myLeaves.find(l => cell.dateString >= l.start && cell.dateString <= l.end);
  const teamLeave = teamLeaves.find(t => cell.dateString >= t.start && cell.dateString <= t.end);
  const isWeekend = index % 7 === 5 || index % 7 === 6;

  const isSelectedStart = rangeStart === cell.dateString;
  const isSelectedEnd = rangeEnd === cell.dateString;
  const isWithinRange = rangeStart && rangeEnd && cell.dateString >= rangeStart && cell.dateString <= rangeEnd;
  const isSingleDaySelection = isSelectedStart && isSelectedEnd;

  return (
    <div
      onClick={() => cell.day && onCellClick(cell.dateString)}
      className={cn(
        "min-h-26.25 p-2 flex flex-col gap-1.5 transition-all relative cursor-pointer select-none",
        !cell.day ? "bg-muted/5 opacity-40 pointer-events-none" : "bg-background hover:bg-muted/15",
        hasHoliday && "bg-emerald-50/40 dark:bg-emerald-950/10",
        isWithinRange && "bg-primary/10 dark:bg-primary/20",
        isSelectedStart && !isSingleDaySelection && "rounded-l-xl border-l-4 border-l-primary bg-primary/15 dark:bg-primary/25",
        isSelectedEnd && !isSingleDaySelection && "rounded-r-xl border-r-4 border-r-primary bg-primary/15 dark:bg-primary/25",
        isSingleDaySelection && "rounded-xl border-x-4 border-primary bg-primary/15 dark:bg-primary/25"
      )}
    >
      {isSelectedEnd && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 animate-in fade-in-0 zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            size="sm"
            className="cursor-pointer font-medium text-[11px] h-7 px-3 rounded-full shadow-lg hover:shadow-xl transition-all bg-primary text-primary-foreground"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="mr-1.5 size-3" /> İzin Talebi Oluştur
          </Button>
        </div>
      )}

      <div className="flex justify-between items-start w-full">
        <span className={cn(
          "flex items-center justify-center size-7 text-xs font-semibold rounded-full transition-all duration-300",
          isWeekend && !(isSelectedStart || isSelectedEnd) ? "text-rose-500/80" : "text-foreground",
          (isSelectedStart || isSelectedEnd) && "bg-primary text-primary-foreground shadow-md ring-4 ring-primary/20 scale-105"
        )}>
          {cell.day}
        </span>
        {hasHoliday && (
            <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded-md truncate max-w-20">
            {hasHoliday.name}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1 mt-auto w-full">
        {myLeave && (
          <div className={cn(
            "text-[10px] py-1 px-1.5 rounded-md font-medium truncate shadow-sm flex items-center gap-1.5 transition-all",
            myLeave.status === 'approved'
              ? "bg-primary text-primary-foreground"
              : "bg-primary/10 text-primary border border-dashed border-primary/50"
          )}>
            {myLeave.status === 'pending' && <Clock className="size-3 shrink-0 animate-pulse" />}
            <span>{getLeaveTypeLabel(myLeave.type)}</span>
          </div>
        )}
        {teamLeave && !myLeave && (
          <div className="text-[10px] py-1 px-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-blue-700 dark:text-blue-300 rounded-md font-medium truncate flex items-center gap-1.5">
            <span className="size-4 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center text-[8px] font-bold text-blue-800 dark:text-blue-200">
              {teamLeave.user.charAt(0)}
            </span>
            <span className="truncate">{teamLeave.user} ({getLeaveTypeLabel(teamLeave.type)})</span>
          </div>
        )}
      </div>
    </div>
  );
}