import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { LeaveBalanceCard } from '@/components/dashboard/LeaveBalanceCard';
import { toast } from "sonner"
import { LeaveType } from '@/enums/leaveType';
import { useCreateLeave } from '@/hooks/leave/useLeaveMutations';
import { useGetCalendarLeaves } from '@/hooks/leave/useGetCalendarLeaves';
import { TimeOffHeader } from '../../components/dashboard/leave/TimeOffHeader';
import { CalendarDayCell, type CalendarCell } from '../../components/dashboard/leave/CalendarDayCell';
import { CalendarLegend } from '../../components/dashboard/leave/CalendarLegend';
import { CalendarControls } from '../../components/dashboard/leave/CalendarControls';


export function TimeOffPage() {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const createLeaveMutation = useCreateLeave();

  const { data: calendarData, isLoading: isCalendarLoading } = useGetCalendarLeaves(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1
  );

  const myLeaves = calendarData?.myLeaves?.map(l => ({ ...l, start: l.start.split('T')[0], end: l.end.split('T')[0] })) || [];
  const teamLeaves = calendarData?.teamLeaves?.map(l => ({ ...l, start: l.start.split('T')[0], end: l.end.split('T')[0] })) || [];
  const holidays = calendarData?.holidays?.map(h => ({ ...h, date: h.date.split('T')[0] })) || [];

  // Leave form state
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

  const handlePrevMonth = () => { setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)); };
  const handleNextMonth = () => { setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)); };

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

        <div className="rounded-sm border border-border bg-card shadow-sm overflow-hidden relative">
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