import { Button } from "@/components/ui/button";
import { LeaveType } from "@/enums/leaveType";
import { cn } from "@/lib/utils";
import { Clock, Plus } from "lucide-react";

export type CalendarCell = { day: number | null; dateString: string };

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

export function CalendarDayCell({ cell, index, rangeStart, rangeEnd, onCellClick, setIsDialogOpen, myLeaves, teamLeaves, holidays }: CellProps) {
  const hasHoliday = holidays.find(h => h.date === cell.dateString);
  const myLeave = myLeaves.find(l => cell.dateString >= l.start && cell.dateString <= l.end);
  const teamLeave = teamLeaves.find(t => cell.dateString >= t.start && cell.dateString <= t.end);
  const isWeekend = index % 7 === 5 || index % 7 === 6;

  const isSelectedStart = rangeStart === cell.dateString;
  const isSelectedEnd = rangeEnd === cell.dateString;
  const isWithinRange = rangeStart && rangeEnd && cell.dateString >= rangeStart && cell.dateString <= rangeEnd;
  const isSingleDaySelection = isSelectedStart && isSelectedEnd;

  // 1. Bugünün tarihini hesaplayıp YYYY-MM-DD formatında string'e çeviriyoruz
  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const isToday = cell.dateString === todayString;

  return (
    <div
      onClick={() => cell.day && onCellClick(cell.dateString)}
      className={cn(
        "min-h-26.25 p-2 flex flex-col gap-1.5 transition-all relative cursor-pointer select-none",
        !cell.day ? "bg-muted/5 opacity-40 pointer-events-none" : "bg-background hover:bg-muted/15",
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
          // 2. Eğer gün "bugün" ise ve kullanıcı tarafından seçili değilse, özel stil uyguluyoruz
          isToday && !(isSelectedStart || isSelectedEnd) && "bg-primary/20 text-primary ring-2 ring-primary",
          (isSelectedStart || isSelectedEnd) && "bg-primary text-primary-foreground shadow-md ring-4 ring-primary/20 scale-105"
        )}>
          {cell.day}
        </span>
        {hasHoliday && (
          <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded-sm truncate max-w-25 mt-1 ml-1">
            {hasHoliday.name}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1 mt-auto w-full">
        {myLeave && (
          <div className={cn(
            "text-[10px] py-1 px-1.5 rounded-md font-medium truncate shadow-sm flex items-center gap-1.5 transition-all",
            myLeave.status?.toLowerCase() === 'approved'
              ? "bg-primary text-primary-foreground"
              : "bg-primary/10 text-primary border border-dashed border-primary/50"
          )}>
            {myLeave.status?.toLowerCase() === 'pending' && <Clock className="size-3 shrink-0 animate-pulse" />}
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